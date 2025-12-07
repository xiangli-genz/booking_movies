const Movie = require("../../models/movie.model");
const Booking = require("../../models/booking.model");
const Cinema = require("../../models/cinema.model");

const generateHelper = require("../../helpers/generate.helper");
const moment = require("moment");

module.exports.createPost = async (req, res) => {
  try {
    req.body.bookingCode = "BK" + generateHelper.generateRandomNumber(10);
    
    const { movieId, cinema, showtimeDate, showtimeTime, showtimeFormat, seats, combos } = req.body;
    
    // Lấy thông tin phim
    const movie = await Movie.findOne({
      _id: movieId,
      status: "active",
      deleted: false
    });

    if(!movie) {
      return res.json({
        code: "error",
        message: "Phim không tồn tại hoặc đã ngừng chiếu!"
      });
    }

    // Tính tổng tiền vé
    let subTotal = 0;
    const seatDetails = seats.map(seat => {
      let seatType = 'standard';
      let price = movie.prices.standard;
      
      if(seat.startsWith('V')) {
        seatType = 'vip';
        price = movie.prices.vip;
      } else if(seat.startsWith('C')) {
        seatType = 'couple';
        price = movie.prices.couple;
      }
      
      subTotal += price;
      
      return {
        seatNumber: seat,
        type: seatType,
        price: price
      };
    });

    // Tính tổng tiền combo
    let comboTotal = 0;
    const comboDetails = [];
    if(combos) {
      Object.keys(combos).forEach(key => {
        const combo = combos[key];
        if(combo && combo.quantity > 0) {
          const totalPrice = combo.price * combo.quantity;
          comboTotal += totalPrice;
          comboDetails.push({
            name: combo.name,
            quantity: combo.quantity,
            price: combo.price,
            totalPrice: totalPrice
          });
        }
      });
    }

    // Giảm giá
    req.body.discount = 0;

    // Tổng thanh toán
    req.body.total = subTotal + comboTotal - req.body.discount;

    // Lưu thông tin đặt vé
    const newBooking = new Booking({
      bookingCode: req.body.bookingCode,
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email || "",
      note: req.body.note || "",
      movieId: movie._id,
      movieName: movie.name,
      movieAvatar: movie.avatar,
      cinema: cinema,
      showtime: {
        date: new Date(showtimeDate),
        time: showtimeTime,
        format: showtimeFormat
      },
      seats: seatDetails,
      combos: comboDetails,
      subTotal: subTotal,
      comboTotal: comboTotal,
      discount: req.body.discount,
      total: req.body.total,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: "unpaid",
      status: "initial"
    });

    await newBooking.save();

    // Cập nhật ghế đã đặt trong movie (để tránh đặt trùng)
    // Chỉ cập nhật tạm thời, sẽ xóa nếu không thanh toán trong 10 phút
    await Movie.updateOne(
      { _id: movieId },
      { $addToSet: { "seatMap.bookedSeats": { $each: seats } } }
    );

    res.json({
      code: "success",
      message: "Đặt vé thành công!",
      bookingId: newBooking.id
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đặt vé không thành công!"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    const { bookingId, phone } = req.query;

    const bookingDetail = await Booking.findOne({
      _id: bookingId,
      phone: phone
    });

    if(!bookingDetail) {
      res.redirect("/");
      return;
    }

    bookingDetail.paymentMethodName = {
      money: "Tiền mặt tại quầy",
      zalopay: "ZaloPay",
      bank: "Chuyển khoản ngân hàng",
      momo: "Momo"
    }[bookingDetail.paymentMethod] || bookingDetail.paymentMethod;

    bookingDetail.paymentStatusName = bookingDetail.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán";
    
    bookingDetail.statusName = {
      initial: "Đang xử lý",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành"
    }[bookingDetail.status] || bookingDetail.status;

    bookingDetail.createdAtFormat = moment(bookingDetail.createdAt).format("HH:mm - DD/MM/YYYY");
    bookingDetail.showtimeDateFormat = moment(bookingDetail.showtime.date).format("DD/MM/YYYY");

    res.render("client/pages/booking-success", {
      pageTitle: "Đặt vé thành công",
      bookingDetail: bookingDetail
    });

  } catch (error) {
    res.redirect("/");
  }
}

// Lấy danh sách ghế đã đặt
module.exports.getBookedSeats = async (req, res) => {
  try {
    const { movieId, cinema, date, time } = req.query;
    
    const movie = await Movie.findById(movieId);
    
    if(!movie) {
      return res.json({
        code: "error",
        message: "Phim không tồn tại"
      });
    }

    // Lấy danh sách ghế đã đặt từ các booking đã confirm
    const bookings = await Booking.find({
      movieId: movieId,
      cinema: cinema,
      "showtime.date": new Date(date),
      "showtime.time": time,
      status: { $in: ["initial", "confirmed"] },
      deleted: false
    });

    const bookedSeats = [];
    bookings.forEach(booking => {
      booking.seats.forEach(seat => {
        bookedSeats.push(seat.seatNumber);
      });
    });

    res.json({
      code: "success",
      bookedSeats: bookedSeats
    });

  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi khi lấy thông tin ghế"
    });
  }
}

module.exports.combo = async (req, res) => {
  try {
    res.render("client/pages/booking-combo", {
      pageTitle: "Chọn Combo"
    });
  } catch (error) {
    res.redirect("/");
  }
}
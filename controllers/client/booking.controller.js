// controllers/client/booking.controller.js
const Movie = require("../../models/movie.model");
const Booking = require("../../models/booking.model");
const Cinema = require("../../models/cinema.model");
const variableConfig = require("../../config/variable");

const generateHelper = require("../../helpers/generate.helper");
const moment = require("moment");

module.exports.createPost = async (req, res) => {
  try {
    // Tạo mã booking
    const bookingCode = "BK" + generateHelper.generateRandomNumber(10);
    
    let { movieId, cinema, showtimeDate, showtimeTime, showtimeFormat, seats, combos, fullName, phone, email, note, paymentMethod } = req.body;
    
    // ===== FIX: Parse seats nếu là string =====
    if (typeof seats === 'string') {
      try {
        seats = JSON.parse(seats);
      } catch (e) {
        console.error('Error parsing seats:', e);
        return res.json({
          code: "error",
          message: "Dữ liệu ghế không hợp lệ!"
        });
      }
    }
    
    // ===== FIX: Parse combos nếu là string =====
    if (typeof combos === 'string') {
      try {
        combos = JSON.parse(combos);
      } catch (e) {
        console.error('Error parsing combos:', e);
        combos = {};
      }
    }
    // ==========================================
    
    // Validate dữ liệu đầu vào
    if (!movieId || !cinema || !showtimeDate || !showtimeTime || !seats || seats.length === 0) {
      return res.json({
        code: "error",
        message: "Thiếu thông tin đặt vé bắt buộc!"
      });
    }

    if (!fullName || !phone) {
      return res.json({
        code: "error",
        message: "Vui lòng nhập đầy đủ họ tên và số điện thoại!"
      });
    }

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

    // ===== FIX: Xử lý seats - hỗ trợ cả array of strings và array of objects =====
    let subTotal = 0;
    const seatDetails = [];
    
    // Đảm bảo seats là array
    if (!Array.isArray(seats)) {
      return res.json({
        code: "error",
        message: "Dữ liệu ghế không đúng định dạng!"
      });
    }
    
    // Xử lý từng ghế
    for (const seat of seats) {
      let seatNumber, seatType, price;
      
      // TH1: seat là object {seatNumber, type, price}
      if (typeof seat === 'object' && seat !== null && seat.seatNumber) {
        seatNumber = seat.seatNumber;
        seatType = seat.type || 'standard';
        price = seat.price || (movie.prices && movie.prices[seatType]) || 50000;
      } 
      // TH2: seat là string thuần (legacy hoặc từ frontend cũ)
      else if (typeof seat === 'string') {
        seatNumber = seat;
        
        // Xác định loại ghế dựa vào ký tự đầu của seatNumber
        if (seatNumber.startsWith('V')) {
          seatType = 'vip';
          price = (movie.prices && movie.prices.vip) || 60000;
        } else if (seatNumber.startsWith('C') || seatNumber.includes('-')) {
          seatType = 'couple';
          price = (movie.prices && movie.prices.couple) || 110000;
        } else {
          seatType = 'standard';
          price = (movie.prices && movie.prices.standard) || 50000;
        }
      } 
      // TH3: Không hợp lệ
      else {
        console.error('Invalid seat format:', seat);
        continue;
      }
      
      subTotal += price;
      
      seatDetails.push({
        seatNumber: seatNumber,
        type: seatType,
        price: price
      });
    }
    
    // Kiểm tra xem có ghế hợp lệ không
    if (seatDetails.length === 0) {
      return res.json({
        code: "error",
        message: "Không có ghế hợp lệ được chọn!"
      });
    }
    // ==========================================

    // Tính tổng tiền combo
    let comboTotal = 0;
    const comboDetails = [];
    
    if(combos && typeof combos === 'object') {
      Object.keys(combos).forEach(key => {
        const combo = combos[key];
        if(combo && combo.quantity && combo.quantity > 0) {
          const quantity = parseInt(combo.quantity) || 0;
          const price = parseInt(combo.price) || 0;
          const totalPrice = price * quantity;
          
          comboTotal += totalPrice;
          comboDetails.push({
            name: combo.name || key,
            quantity: quantity,
            price: price,
            totalPrice: totalPrice
          });
        }
      });
    }

    // Giảm giá
    const discount = 0;

    // Tổng thanh toán
    const total = subTotal + comboTotal - discount;

    // ===== FIX: Chuyển đổi showtimeDate sang Date object =====
    let showtimeDateObj;
    try {
      // Nếu showtimeDate đã là Date object
      if (showtimeDate instanceof Date) {
        showtimeDateObj = showtimeDate;
      } 
      // Nếu là ISO string hoặc date string
      else if (typeof showtimeDate === 'string') {
        showtimeDateObj = new Date(showtimeDate);
      }
      // Fallback
      else {
        showtimeDateObj = new Date(showtimeDate);
      }
      
      // Kiểm tra valid date
      if (isNaN(showtimeDateObj.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      console.error('Date conversion error:', error);
      return res.json({
        code: "error",
        message: "Ngày chiếu không hợp lệ!"
      });
    }
    // ==========================================

    // Lưu thông tin đặt vé
    const newBooking = new Booking({
      bookingCode: bookingCode,
      fullName: fullName,
      phone: phone,
      email: email || "",
      note: note || "",
      movieId: movie._id,
      movieName: movie.name,
      movieAvatar: movie.avatar,
      cinema: cinema,
      showtime: {
        date: showtimeDateObj,
        time: showtimeTime,
        format: showtimeFormat || "2D"
      },
      seats: seatDetails,
      combos: comboDetails,
      subTotal: subTotal,
      comboTotal: comboTotal,
      discount: discount,
      total: total,
      paymentMethod: paymentMethod || "money",
      paymentStatus: "unpaid",
      status: "initial",
      userId: req.user ? req.user.id : null
    });

    await newBooking.save();

    res.json({
      code: "success",
      message: "Đặt vé thành công!",
      bookingId: newBooking._id
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.json({
      code: "error",
      message: "Đặt vé không thành công! Lỗi: " + error.message
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    const { bookingId, phone } = req.query;

    if (!bookingId || !phone) {
      res.redirect("/");
      return;
    }

    const bookingDetail = await Booking.findOne({
      _id: bookingId,
      phone: phone,
      deleted: false
    });

    if(!bookingDetail) {
      res.redirect("/");
      return;
    }

    // Format payment method
    bookingDetail.paymentMethodName = {
      money: "Tiền mặt tại quầy",
      zalopay: "ZaloPay",
      bank: "Chuyển khoản ngân hàng",
      momo: "Momo"
    }[bookingDetail.paymentMethod] || bookingDetail.paymentMethod;

    // Format payment status
    bookingDetail.paymentStatusName = bookingDetail.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán";
    
    // Format booking status
    bookingDetail.statusName = {
      initial: "Đang xử lý",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành"
    }[bookingDetail.status] || bookingDetail.status;

    // Format dates
    bookingDetail.createdAtFormat = moment(bookingDetail.createdAt).format("HH:mm - DD/MM/YYYY");
    bookingDetail.showtimeDateFormat = moment(bookingDetail.showtime.date).format("DD/MM/YYYY");

    res.render("client/pages/booking-success", {
      pageTitle: "Đặt vé thành công",
      bookingDetail: bookingDetail
    });

  } catch (error) {
    console.error("Error in booking success:", error);
    res.redirect("/");
  }
}

module.exports.getBookedSeats = async (req, res) => {
  try {
    const { movieId, cinema, date, time } = req.query;
    
    if (!movieId || !cinema || !date || !time) {
      return res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết"
      });
    }

    const movie = await Movie.findById(movieId);
    
    if(!movie) {
      return res.json({
        code: "error",
        message: "Phim không tồn tại"
      });
    }

    // Chuyển đổi date string sang Date object
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // Lấy danh sách ghế đã đặt từ các booking
    const bookings = await Booking.find({
      movieId: movieId,
      cinema: cinema,
      "showtime.date": {
        $gte: startOfDay,
        $lte: endOfDay
      },
      "showtime.time": time,
      status: { $in: ["initial", "confirmed"] },
      deleted: false
    });

    const bookedSeats = [];
    bookings.forEach(booking => {
      if (booking.seats && booking.seats.length > 0) {
        booking.seats.forEach(seat => {
          bookedSeats.push(seat.seatNumber);
        });
      }
    });

    res.json({
      code: "success",
      bookedSeats: bookedSeats
    });

  } catch (error) {
    console.error("Error getting booked seats:", error);
    res.json({
      code: "error",
      message: "Lỗi khi lấy thông tin ghế"
    });
  }
}

module.exports.combo = async (req, res) => {
  try {
    const { movieId } = req.query;
    
    if (!movieId) {
      res.redirect("/");
      return;
    }
    
    const movie = await Movie.findOne({
      _id: movieId,
      status: "active",
      deleted: false
    });
    
    if (!movie) {
      res.redirect("/");
      return;
    }
    
    const combos = variableConfig.defaultCombos || [];
    
    res.render("client/pages/booking-combo", {
      pageTitle: "Chọn Combo",
      movieDetail: movie,
      combos: combos
    });
  } catch (error) {
    console.error("Error in combo page:", error);
    res.redirect("/");
  }
};

module.exports.checkout = async (req, res) => {
  try {
    res.render('client/pages/booking-checkout', {
      pageTitle: 'Xác nhận & Thanh toán',
      movieDetail: {}
    });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.redirect('/');
  }
};
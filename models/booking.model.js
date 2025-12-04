const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    bookingCode: String, // Mã đặt vé (VD: BK0001234567)
    fullName: String,
    phone: String,
    email: String,
    note: String,
    
    // Thông tin đặt vé
    movieId: String, // ID phim
    movieName: String, // Tên phim
    movieAvatar: String, // Poster phim
    cinema: String, // Rạp chiếu
    showtime: {
      date: Date, // Ngày chiếu
      time: String, // Giờ chiếu (VD: "18:00")
      format: String // Định dạng (2D, 3D, IMAX)
    },
    
    // Thông tin ghế
    seats: [{
      seatNumber: String, // Số ghế (VD: "A1", "V2-3")
      type: String, // Loại ghế (standard, vip, couple)
      price: Number // Giá ghế
    }],
    
    // Thông tin combo
    combos: [{
      name: String, // Tên combo
      quantity: Number, // Số lượng
      price: Number, // Giá
      totalPrice: Number // Tổng tiền = quantity * price
    }],
    
    // Thanh toán
    subTotal: Number, // Tổng tiền vé
    comboTotal: Number, // Tổng tiền combo
    discount: {
      type: Number,
      default: 0
    },
    total: Number, // Tổng thanh toán
    paymentMethod: String, // money, zalopay, bank, momo
    paymentStatus: String, // unpaid, paid
    
    // Trạng thái đặt vé
    status: String, // initial, confirmed, cancelled, completed
    
    // QR Code cho vé
    qrCode: String,
    
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', schema, "bookings");

module.exports = Booking;
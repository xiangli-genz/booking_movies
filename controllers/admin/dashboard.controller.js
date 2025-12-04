const AccountAdmin = require("../../models/account-admin.model");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");
const variableConfig = require("../../config/variable");

module.exports.dashboard = async (req, res) => {
  // Section 1 - Overview
  const overview = {
    totalAdmin: 0,
    totalUser: 0,
    totalBooking: 0,
    totalRevenue: 0
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({ deleted: false });
  overview.totalUser = await User.countDocuments({ deleted: false });

  const bookingList = await Booking.find({ deleted: false });
  overview.totalBooking = bookingList.length;
  overview.totalRevenue = bookingList.reduce((sum, item) => sum + item.total, 0);

  // Recent bookings
  const bookings = await Booking
    .find({ deleted: false })
    .sort({ createdAt: -1 })
    .limit(5);

  for (const booking of bookings) {
    booking.paymentMethodName = {
      money: "Tiền mặt",
      zalopay: "ZaloPay",
      bank: "Chuyển khoản",
      momo: "Momo"
    }[booking.paymentMethod] || booking.paymentMethod;

    booking.paymentStatusName = booking.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán";

    booking.statusName = {
      initial: "Đang xử lý",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành"
    }[booking.status] || booking.status;

    // Format seat list
    booking.seatList = booking.seats.map(s => s.seatNumber).join(", ");
    
    // Format combo list
    if(booking.combos && booking.combos.length > 0) {
      booking.comboList = booking.combos.map(c => `${c.name} x${c.quantity}`).join(", ");
    } else {
      booking.comboList = "Không có";
    }
  }

  res.render("admin/pages/dashboard", {
    pageTitle: "Tổng quan",
    overview: overview,
    bookings: bookings
  });
}

module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

  const bookingsCurrentMonth = await Booking.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1)
    }
  });

  const bookingsPreviousMonth = await Booking.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lt: new Date(previousYear, previousMonth, 1)
    }
  });

  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    let totalCurrent = 0;
    for (const booking of bookingsCurrentMonth) {
      const bookingDate = new Date(booking.createdAt).getDate();
      if(day == bookingDate) {
        totalCurrent += booking.total;
      }
    }
    dataMonthCurrent.push(totalCurrent);

    let totalPrevious = 0;
    for (const booking of bookingsPreviousMonth) {
      const bookingDate = new Date(booking.createdAt).getDate();
      if(day == bookingDate) {
        totalPrevious += booking.total;
      }
    }
    dataMonthPrevious.push(totalPrevious);
  }

  res.json({
    code: "success",
    dataMonthCurrent: dataMonthCurrent,
    dataMonthPrevious: dataMonthPrevious
  });
}
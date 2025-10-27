const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const variableConfig = require("../../config/variable");

module.exports.dashboard = async (req, res) => {
  // Section 1
  const overview = {
    totalAdmin: 0,
    totalUser: 0,
    totalOrder: 0,
    totalPrice: 0
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({ deleted: false });

  const orderList = await Order.find({ deleted: false });
  overview.totalOrder = orderList.length;
  overview.totalPrice = orderList.reduce((sum, item) => sum + item.total, 0);
  // End Section 1

  // Lấy 3 đơn hàng mới nhất
  const orders = await Order.find({ deleted: false }).sort({ createdAt: -1 }).limit(3);

  // Process each order - calculate totals and map payment labels
  for (const order of orders) {
    // Map payment labels
    const pm = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod);
    order.paymentMethodName = pm ? pm.label : (order.paymentMethod || "--");

    const ps = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus);
    order.paymentStatusName = ps ? ps.label : (order.paymentStatus || "--");

    // Calculate item prices and order total
    order.subTotal = 0;
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        // Calculate adult total
        if (item.adult) {
          item.adultPrice = item.priceNewAdult || item.priceAdult || 0;
          item.adultTotal = item.adult * item.adultPrice;
          order.subTotal += item.adultTotal;
        }
        // Calculate child total
        if (item.child) {
          item.childPrice = item.priceNewChildren || item.priceChildren || 0;
          item.childTotal = item.child * item.childPrice;
          order.subTotal += item.childTotal;
        }
        // Calculate baby total
        if (item.baby) {
          item.babyPrice = item.priceNewBaby || item.priceBaby || 0;
          item.babyTotal = item.baby * item.babyPrice;
          order.subTotal += item.babyTotal;
        }
      }
    }
    
    // Set totals with safe defaults
    order.subTotal = order.subTotal || 0;
    order.discount = order.discount || 0;
    order.total = (order.total || order.subTotal) - order.discount;
  }

  res.render("admin/pages/dashboard", {
    pageTitle: "Tổng quan",
    overview: overview,
    orders: orders
  });
}
module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

  // Truy vấn tất cả đơn hàng trong tháng hiện tại
  const ordersCurrentMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1)
    }
  })

  // Truy vấn tất cả đơn hàng trong tháng trước
  const ordersPreviousMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lt: new Date(previousYear, previousMonth, 1)
    }
  })

  // Tạo mảng doanh thu theo từng ngày
  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    // Tính tổng doanh thu theo từng ngày của tháng này
    let totalCurrent = 0;
    for (const order of ordersCurrentMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalCurrent += order.total;
      }
    }
    dataMonthCurrent.push(totalCurrent);

    // Tính tổng doanh thu theo từng ngày của tháng trước
    let totalPrevious = 0;
    for (const order of ordersPreviousMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalPrevious += order.total;
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

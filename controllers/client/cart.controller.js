const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const User = require("../../models/user.model");
const moment = require("moment");

module.exports.cart = async (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Giỏ hàng"
  })
}

module.exports.detail = async (req, res) => {
  try {
    let cart = req.body;

    // Nếu user đã đăng nhập, lấy giỏ hàng từ database
    if (req.user) {
      const user = await User.findById(req.user.id);
      cart = user.cart || [];
    }

    for(const item of cart) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false
      });

      if(tourInfo) {
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
        item.slug = tourInfo.slug;
        item.departureDateFormat = moment(tourInfo.departureDate).format("DD/MM/YYYY");
        
        // Tính tiền ghế
        item.totalSeatPrice = 0;
        if (item.seats && item.seats.length > 0) {
          item.seats.forEach(seat => {
            if (seat.startsWith('V')) {
              item.totalSeatPrice += 60000; // VIP
            } else if (seat.startsWith('C')) {
              item.totalSeatPrice += 110000; // Couple
            } else {
              item.totalSeatPrice += 50000; // Standard (Normal)
            }
          });
        }
        
        // Tính tiền combo
        item.totalComboPrice = 0;
        if (item.combos) {
          Object.keys(item.combos).forEach(key => {
            const combo = item.combos[key];
            if (combo && combo.quantity > 0) {
              item.totalComboPrice += combo.price * combo.quantity;
            }
          });
        }
        
        item.totalPrice = item.totalSeatPrice + item.totalComboPrice;

        const city = await City.findOne({
          _id: item.locationFrom
        });
        item.locationFromName = city ? city.name : "Chưa chọn";
      } else {
        // Nếu không lấy được tour thì xóa khỏi giỏ hàng
        const indexItem = cart.findIndex(tour => tour.tourId == item.tourId);
        if (indexItem !== -1) {
          cart.splice(indexItem, 1);
        }
      }
    }

    res.json({
      code: "success",
      cart: cart
    })
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra"
    })
  }
}

module.exports.updateCart = async (req, res) => {
  try {
    const { cart } = req.body;

    // Nếu user đã đăng nhập, lưu vào database
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        cart: cart
      });
    }

    res.json({
      code: "success",
      message: "Cập nhật giỏ hàng thành công"
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra"
    });
  }
}

module.exports.syncCart = async (req, res) => {
  try {
    const { localCart } = req.body;

    if (req.user) {
      const user = await User.findById(req.user.id);
      
      // Merge giỏ hàng local với giỏ hàng trong database
      let dbCart = user.cart || [];
      
      if (localCart && localCart.length > 0) {
        localCart.forEach(localItem => {
          const existIndex = dbCart.findIndex(
            dbItem => dbItem.tourId === localItem.tourId
          );
          
          if (existIndex === -1) {
            dbCart.push(localItem);
          }
        });
      }

      await User.findByIdAndUpdate(req.user.id, {
        cart: dbCart
      });

      res.json({
        code: "success",
        cart: dbCart
      });
    } else {
      res.json({
        code: "success",
        cart: localCart || []
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra"
    });
  }
}
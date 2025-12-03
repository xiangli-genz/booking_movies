const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Order = require("../../models/order.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");
const variableConfig = require("../../config/variable");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user-register", {
    pageTitle: "Đăng ký tài khoản"
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if (existUser) {
    res.json({
      code: "error",
      message: "Email đã tồn tại!"
    });
    return;
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    phone: phone,
    status: "active"
  });

  await newUser.save();

  // Tạo JWT token
  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

  // Lưu token vào cookie
  res.cookie("tokenUser", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  });
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user-login", {
    pageTitle: "Đăng nhập"
  });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existUser.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    });
    return;
  }

  if (existUser.status != "active") {
    res.json({
      code: "error",
      message: "Tài khoản đã bị khóa!"
    });
    return;
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      id: existUser.id,
      email: existUser.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? '30d' : "7d"
    }
  );

  // Lưu token vào cookie
  res.cookie("tokenUser", token, {
    maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
    cart: existUser.cart || []
  });
}

// [GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/user-profile", {
    pageTitle: "Thông tin cá nhân"
  });
}

// [PATCH] /user/profile/edit
module.exports.profileEditPatch = async (req, res) => {
  try {
    const id = req.user.id;

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await User.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash('success', 'Cập nhật thông tin thành công!');

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: error
    });
  }
}

// [GET] /user/change-password
module.exports.changePassword = async (req, res) => {
  res.render("client/pages/user-change-password", {
    pageTitle: "Đổi mật khẩu"
  });
}

// [PATCH] /user/change-password
module.exports.changePasswordPatch = async (req, res) => {
  try {
    const id = req.user.id;
    const { oldPassword, password } = req.body;

    const user = await User.findOne({
      _id: id,
      deleted: false
    });

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      res.json({
        code: "error",
        message: "Mật khẩu cũ không đúng!"
      });
      return;
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne({
      _id: id,
      deleted: false
    }, {
      password: hashedPassword
    });

    req.flash("success", "Đổi mật khẩu thành công!");

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: error
    });
  }
}

// [GET] /user/orders
module.exports.orders = async (req, res) => {
  const orders = await Order.find({
    phone: req.user.phone,
    deleted: false
  }).sort({
    createdAt: "desc"
  });

  for (const order of orders) {
    const pm = variableConfig.paymentMethod.find(item => item.value == order.paymentMethod);
    order.paymentMethodName = pm ? pm.label : (order.paymentMethod || "--");

    const ps = variableConfig.paymentStatus.find(item => item.value == order.paymentStatus);
    order.paymentStatusName = ps ? ps.label : (order.paymentStatus || "--");

    const os = variableConfig.orderStatus.find(item => item.value == order.status);
    order.statusName = os ? os.label : (order.status || "--");

    order.createdAtFormat = moment(order.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("client/pages/user-orders", {
    pageTitle: "Đơn hàng của tôi",
    orders: orders
  });
}

// [GET] /user/forgot-password
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user-forgot-password", {
    pageTitle: "Quên mật khẩu"
  });
}

// [POST] /user/forgot-password
module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    });
    return;
  }

  // Kiểm tra xem email đã gửi otp chưa
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  });

  if (existEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Email đã được gửi mã OTP, vui lòng kiểm tra email và thử lại sau 5 phút!"
    });
    return;
  }

  // Tạo mã OTP
  const otp = generateHelper.generateRandomNumber(6);

  // Lưu mã OTP vào DB
  const newRecord = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000 // 5 phút
  });
  await newRecord.save();

  // Gửi mã OTP về email
  const subject = `Mã OTP lấy lại mật khẩu`;
  const content = `Mã OTP của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai.`;
  mailHelper.sendMail(email, subject, content);

  res.json({
    code: "success",
    message: "Gửi mã OTP thành công!"
  });
}

// [GET] /user/otp-password
module.exports.otpPassword = async (req, res) => {
  res.render("client/pages/user-otp-password", {
    pageTitle: "Xác thực OTP"
  });
}

// [POST] /user/otp-password
module.exports.otpPasswordPost = async (req, res) => {
  const { otp, email } = req.body;

  const existRecord = await ForgotPassword.findOne({
    otp: otp,
    email: email
  });

  if (!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!"
    });
    return;
  }

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  // Tạo JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  );

  // Lưu token vào cookie
  res.cookie("tokenUser", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Xác thực OTP thành công!"
  });
}

// [GET] /user/reset-password
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user-reset-password", {
    pageTitle: "Đặt lại mật khẩu"
  });
}

// [POST] /user/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.updateOne({
    _id: req.user.id,
    deleted: false,
    status: "active"
  }, {
    password: hashedPassword
  });

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!"
  });
}

// [POST] /user/logout
module.exports.logoutPost = async (req, res) => {
  // Lưu giỏ hàng vào database trước khi đăng xuất
  if (req.user) {
    // Giỏ hàng đã được sync tự động, không cần làm gì thêm
  }
  
  res.clearCookie("tokenUser");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  });
}
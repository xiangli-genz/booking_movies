const AccountAdmin = require("../../models/account-admin.model")
const ForgotPassword = require("../../models/forgot-password.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login",{
    pageTitle: "Đăng nhập"
  })
}

module.exports.loginPost = async (req, res) => {
  const {email, password, rememberPassword} = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);
  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    });
    return;
  }

  if (existAccount.status != "active") {
    res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!"
    });
    return;
  }

  // Tạo JWt
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? '30d' : "7d"
    }
  )
  
  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: rememberPassword ? (30*24*60*60*1000) : (7*24*60*60*1000),
    httpOnly: true,
    sameSite: "strict"
  })

  res.json({
    code: "success",
    message: "Đăng nhập tài khoản  thành công!"
  });
}

module.exports.register = async (req, res) => {
  res.render("admin/pages/register",{
    pageTitle: "Đăng ký"
  })
}

module.exports.registerInitial = async (req, res) => {
  res.render("admin/pages/register-initial",{
    pageTitle: "Tài khoản đã được khởi tạo"
  })
}

module.exports.registerPost = async (req, res) => {
  const {fullName, email, password} = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if (existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại!"
    });
    return;
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "active"
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  });
}

module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/forgot-password",{
    pageTitle: "Quên mật khẩu"
  })
}

module.exports.forgotPasswordPost = async (req, res) => {
 const {email} = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  })

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    })
    return;
  }

  //kiem tra xem email da gui otp chua
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  })

  if(existEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Email đã được gửi mã OTP, vui lòng kiểm tra email và thử lại sau 5 phút! "
    })
    return;
  }

  // Tạo mã OTP
  const otp = generateHelper.generateRandomNumber(6);
  
  // Lưu mã OTP vào DB
  const newRecord = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5*60*1000 // 5 phút
  })
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

module.exports.otpPassword = async (req, res) => {
  res.render("admin/pages/otp-password",{
    pageTitle: "Xác thực OTP"
  })
}

module.exports.otpPasswordPost = async (req, res) => {
  const { otp, email } = req.body;

  // Kiem tra 
  const existRecord = await ForgotPassword.findOne({
    otp: otp,
    email: email
  })

  if(!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!"
    })
    return;
  }

  const account = await AccountAdmin.findOne({
    email: email
  })

  // Tạo JWt
  const token = jwt.sign(
    {
      id: account.id,
      email: account.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )
  
  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 24*60*60*1000,
    httpOnly: true,
    sameSite: "strict"
  })

  res.json({
    code: "success",
    message: "Xác thực OTP thành công!"
  })
}

module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/reset-password",{
    pageTitle: "Đặt lại mật khẩu"
  })
}

module.exports.resetPasswordPost = async (req, res) => {
  const {password} = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await AccountAdmin.updateOne({
    _id: req.account.id,
    deleted: false,
    status: "active"
  }, {
    password: hashedPassword
  })

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!",
  })
}

module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}
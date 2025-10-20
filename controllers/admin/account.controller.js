module.exports.login = async (req, res) => {
    res.render("admin/pages/login", {
        pageTitle: "Đăng nhập"
    })
}
module.exports.register = async (req, res) => {
    res.render("admin/pages/register", {
        pageTitle: "Đăng kí"
    })
}
module.exports.forgotPassword = async (req, res) => {
    res.render("admin/pages/forgot-password", {
        pageTitle: "Quên mật khẩu"
    })
}
module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/otp-password", {
        pageTitle: "Xác thực OTP"
    })
}
module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    })
}
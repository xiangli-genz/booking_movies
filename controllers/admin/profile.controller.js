module.exports.edit = async (req, res) => {
    res.render("admin/pages/profile-edit", {
        pageTitle: "Chỉnh sửa hồ sơ"
    });
}

module.exports.changePassword = async (req, res) => {
    res.render("admin/pages/profile-change-password", {
        pageTitle: "Đổi mật khẩu"
    });
}

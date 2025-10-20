module.exports.list = async (req, res) => {
    res.render("admin/pages/setting-list", {
        pageTitle: "Thông tin cài đặt"
    });
}
module.exports.websiteInfo = async (req, res) => {
    res.render("admin/pages/setting-website-info", {
        pageTitle: "Thông tin website"
    });
}
module.exports.accountAdminList = async (req, res) => {
    res.render("admin/pages/setting-account-admin-list", {
        pageTitle: "Danh sách tài khoản quản trị"
    });
}
module.exports.accountAdminCreate = async (req, res) => {
    res.render("admin/pages/setting-account-admin-create", {
        pageTitle: "Thêm tài khoản quản trị"
    });
}
module.exports.roleList = async (req, res) => {
    res.render("admin/pages/setting-role-list", {
        pageTitle: "Danh sách vai trò"
    });
}
module.exports.roleCreate = async (req, res) => {
    res.render("admin/pages/setting-role-create", {
        pageTitle: "Thêm vai trò"
    });
}
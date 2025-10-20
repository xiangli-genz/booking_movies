module.exports.list = async (req, res) => {
    res.render("admin/pages/order-list", {
        pageTitle: "Quản lí đơn hàng"
    })
}
module.exports.edit = async (req, res) => {
    res.render("admin/pages/order-edit", {
        pageTitle: "Đơn hàng 0000001"
    })
}
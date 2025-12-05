const moment = require("moment");
const User = require("../../models/user.model");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  // Lọc theo trạng thái
  if(req.query.status) {
    find.status = req.query.status;
  }

  // Lọc theo ngày tạo
  const dateFilter = {};

  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }

  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;
  }

  if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }

  // Tìm kiếm
  if(req.query.keyword) {
    const keywordRegex = new RegExp(req.query.keyword, "i");
    find.$or = [
      { fullName: keywordRegex },
      { email: keywordRegex },
      { phone: keywordRegex }
    ];
  }

  // PHÂN TRANG
  const limit = 10; // Số bản ghi trên mỗi trang
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  // Đếm tổng số bản ghi
  const totalRecords = await User.countDocuments(find);
  const totalPages = Math.ceil(totalRecords / limit);

  const userList = await User
    .find(find)
    .sort({
      createdAt: "desc"
    });

  for (const item of userList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/user-list", {
    pageTitle: "Quản lý người dùng",
    userList: userList,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalRecords: totalRecords,
      limit: limit
    }
  });
}

module.exports.changeStatusPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await User.updateOne({
      _id: id,
      deleted: false
    }, {
      status: status
    });

    req.flash("success", "Đổi trạng thái thành công!");

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await User.deleteOne({
      _id: id
    });

    req.flash("success", "Xóa người dùng thành công!");

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await User.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await User.deleteMany({
          _id: { $in: ids }
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    });
  }
}
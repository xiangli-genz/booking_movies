const moment = require("moment");
const Category = require("../../models/category.model");
const Cinema = require("../../models/cinema.model");
const Movie = require("../../models/movie.model");
const AccountAdmin = require("../../models/account-admin.model");
const categoryHelper = require("../../helpers/category.helper");
const { default: slugify } = require("slugify");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  }

  if(req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  }

  const dateFiler = {};

  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFiler.$gte = startDate;
  }

  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFiler.$lte = endDate;
  }

  if(Object.keys(dateFiler).length > 0) {
    find.createdAt = dateFiler;
  }

  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    });
    const keywordRegex = new RegExp(keyword);
    find.slug = keywordRegex;
  }

  // Pagination

  const movieList = await Movie
    .find(find)
    .sort({
      position: "desc"
    })

  for (const item of movieList) {
    if(item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : "-";
    }

    if(item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoAccountUpdated ? infoAccountUpdated.fullName : "-";
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    // FORMAT NGÀY CÔNG CHIẾU - ĐÂY LÀ PHẦN QUAN TRỌNG
    if(item.releaseDate) {
      item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    } else {
      item.releaseDateFormat = "--";
    }
  }

  const accountAdminList = await AccountAdmin
    .find({})
    .select("id fullName");

  res.render("admin/pages/movie-list", {
    pageTitle: "Quản lý phim",
    movieList: movieList,
    accountAdminList: accountAdminList,
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })

  const categoryTree = categoryHelper.buildCategoryTree(categoryList);

  const cinemaList = await Cinema.find({ status: "active" });

  res.render("admin/pages/movie-create", {
    pageTitle: "Thêm phim mới",
    categoryList: categoryTree,
    cinemaList: cinemaList
  })
}

module.exports.createPost = async (req, res) => {
  try {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Movie.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    
    if(req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
    }

    // Xử lý giá vé
    req.body.prices = {
      standard: parseInt(req.body.priceStandard) || 50000,
      vip: parseInt(req.body.priceVip) || 60000,
      couple: parseInt(req.body.priceCouple) || 110000
    };

    // Xử lý ngày phát hành
    req.body.releaseDate = req.body.releaseDate ? new Date(req.body.releaseDate) : null;

    // Xử lý lịch chiếu
    if(req.body.showtimes) {
      if(typeof req.body.showtimes === 'string') {
        try {
          req.body.showtimes = JSON.parse(req.body.showtimes);
        } catch (e) {
          req.body.showtimes = [];
        }
      }
    } else {
      req.body.showtimes = [];
    }

    // Xử lý sơ đồ ghế mặc định
    req.body.seatMap = {
      rows: 10,
      columns: 12,
      vipRows: ["V1", "V2"],
      coupleRows: ["C1"],
      bookedSeats: []
    };

    if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    }

    const newRecord = new Movie(req.body);
    await newRecord.save();

    req.flash("success", "Thêm phim mới thành công!")

    res.json({
      code: "success"
    })
  } catch (error) {
    console.error("Error creating movie:", error);
    res.json({
      code: "error",
      message: error.message || "Có lỗi xảy ra khi tạo phim"
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const movieDetail = await Movie.findOne({
      _id: id,
      deleted: false
    })

    if(movieDetail) {
      movieDetail.releaseDateFormat = moment(movieDetail.releaseDate).format("YYYY-MM-DD");
      
      const categoryList = await Category.find({
        deleted: false
      })
  
      const categoryTree = categoryHelper.buildCategoryTree(categoryList);

      const cinemaList = await Cinema.find({ status: "active" });
  
      res.render("admin/pages/movie-edit", {
        pageTitle: "Chỉnh sửa phim",
        categoryList: categoryTree,
        cinemaList: cinemaList,
        movieDetail: movieDetail
      })
    } else {
      res.redirect(`/${pathAdmin}/movie/list`);
    }
  } catch (error) {
    res.redirect(`/${pathAdmin}/movie/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    }

    req.body.updatedBy = req.account.id;
    
    if(req.files) {
      req.body.avatar = req.files.avatar.path;
    } else {
      delete req.body.avatar;
    }

    // Xử lý giá vé
    req.body.prices = {
      standard: parseInt(req.body.priceStandard) || 50000,
      vip: parseInt(req.body.priceVip) || 60000,
      couple: parseInt(req.body.priceCouple) || 110000
    };

    req.body.releaseDate = req.body.releaseDate ? new Date(req.body.releaseDate) : null;
    
    // Xử lý lịch chiếu
    if(req.body.showtimes) {
      if(typeof req.body.showtimes === 'string') {
        try {
          req.body.showtimes = JSON.parse(req.body.showtimes);
        } catch (e) {
          req.body.showtimes = [];
        }
      }
    } else {
      req.body.showtimes = [];
    }

    if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }

    await Movie.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật phim thành công!")

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Movie.deleteOne({
      _id: id
    })

    req.flash("success", "Xóa phim thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Movie.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await Movie.deleteMany({
          _id: { $in: ids }
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}
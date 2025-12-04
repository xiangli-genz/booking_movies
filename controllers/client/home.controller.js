const Movie = require("../../models/movie.model");
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

module.exports.home = async (req, res) => {
  // Section 2 - Phim đang chiếu
  const movieListSection2 = await Movie
    .find({
      deleted: false,
      status: "active",
      releaseDate: { $lte: new Date() }
    })
    .sort({
      position: "desc"
    })
    .limit(6);

  for(const item of movieListSection2) {
    item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    
    // Tính số ghế còn trống
    const totalSeats = item.seatMap.rows * item.seatMap.columns;
    const bookedSeats = item.seatMap.bookedSeats ? item.seatMap.bookedSeats.length : 0;
    item.availableSeats = totalSeats - bookedSeats;
  }

  // Section 4: Phim Đang Chiếu
  const categoryIdSection4 = "6798f1234567890abcdef001"; // Thay bằng ID thực tế
  let movieListSection4 = [];
  
  try {
    const listCategoryId = await categoryHelper.getAllSubcategoryIds(categoryIdSection4);
    movieListSection4 = await Movie
      .find({
        category: { $in: listCategoryId },
        deleted: false,
        status: "active",
        releaseDate: { $lte: new Date() }
      })
      .sort({
        position: "desc"
      })
      .limit(3);

    for(const item of movieListSection4) {
      item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    }
  } catch (error) {
    // Nếu không có category, lấy phim đang chiếu
    movieListSection4 = await Movie
      .find({
        deleted: false,
        status: "active",
        releaseDate: { $lte: new Date() }
      })
      .sort({
        position: "desc"
      })
      .limit(3);

    for(const item of movieListSection4) {
      item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    }
  }

  // Section 5: Phim Sắp Chiếu
  const categoryIdSection5 = "6798f1234567890abcdef002"; // Thay bằng ID thực tế
  let movieListSection5 = [];
  
  try {
    const listCategoryIdSection5 = await categoryHelper.getAllSubcategoryIds(categoryIdSection5);
    movieListSection5 = await Movie
      .find({
        category: { $in: listCategoryIdSection5 },
        deleted: false,
        status: "active",
        releaseDate: { $gt: new Date() }
      })
      .sort({
        position: "desc"
      })
      .limit(3);

    for(const item of movieListSection5) {
      item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    }
  } catch (error) {
    // Nếu không có category, lấy phim sắp chiếu
    movieListSection5 = await Movie
      .find({
        deleted: false,
        status: "active",
        releaseDate: { $gt: new Date() }
      })
      .sort({
        releaseDate: "asc"
      })
      .limit(3);

    for(const item of movieListSection5) {
      item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
    }
  }

  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    movieListSection2: movieListSection2,
    movieListSection4: movieListSection4,
    movieListSection5: movieListSection5
  });
}
const Movie = require("../../models/movie.model");
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

module.exports.home = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Phim đang chiếu (releaseDate <= hôm nay)
  const nowShowingMovies = await Movie
    .find({
      deleted: false,
      status: "active",
      releaseDate: { $lte: today }
    })
    .sort({
      releaseDate: "desc",
      position: "desc"
    })
    .limit(8);

  for(const item of nowShowingMovies) {
    item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
  }

  // Phim sắp chiếu (releaseDate > hôm nay)
  const comingSoonMovies = await Movie
    .find({
      deleted: false,
      status: "active",
      releaseDate: { $gt: today }
    })
    .sort({
      releaseDate: "asc",
      position: "desc"
    })
    .limit(8);

  for(const item of comingSoonMovies) {
    item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
  }

  // Section 2 - Flash Sale (giữ nguyên)
  const movieListSection2 = await Movie
    .find({
      deleted: false,
      status: "active",
      releaseDate: { $lte: today }
    })
    .sort({
      position: "desc"
    })
    .limit(6);

  for(const item of movieListSection2) {
    item.releaseDateFormat = moment(item.releaseDate).format("DD/MM/YYYY");
  }

  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    movieListSection2: movieListSection2,
    nowShowingMovies: nowShowingMovies,
    comingSoonMovies: comingSoonMovies
  });
}
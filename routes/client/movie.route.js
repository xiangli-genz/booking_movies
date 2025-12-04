const router = require("express").Router();
const Category = require("../../models/category.model");
const Movie = require("../../models/movie.model");
const Cinema = require("../../models/cinema.model");
const moment = require("moment");

// Chi tiết phim
router.get('/detail/:slug', async (req, res) => {
  const slug = req.params.slug;

  const movieDetail = await Movie.findOne({
    slug: slug,
    status: "active",
    deleted: false
  });

  if(movieDetail) {
    // Breadcrumb
    const breadcrumb = {
      image: movieDetail.avatar,
      title: movieDetail.name,
      list: [
        {
          link: "/",
          title: "Trang Chủ"
        }
      ]
    };

    const category = await Category.findOne({
      _id: movieDetail.category,
      deleted: false,
      status: "active"
    });

    if(category) {
      if(category.parent) {
        const parentCategory = await Category.findOne({
          _id: category.parent,
          deleted: false,
          status: "active"
        });

        if(parentCategory) {
          breadcrumb.list.push({
            link: `/category/${parentCategory.slug}`,
            title: parentCategory.name
          });
        }
      }

      breadcrumb.list.push({
        link: `/category/${category.slug}`,
        title: category.name,
      });
    }

    breadcrumb.list.push({
      link: `/movie/detail/${slug}`,
      title: movieDetail.name
    });

    // Format dữ liệu
    movieDetail.releaseDateFormat = moment(movieDetail.releaseDate).format("DD/MM/YYYY");

    // Lấy danh sách rạp
    const cinemaList = await Cinema.find({ status: "active" });

    // Format lịch chiếu
    if(movieDetail.showtimes) {
      movieDetail.showtimes.forEach(showtime => {
        showtime.dateFormat = moment(showtime.date).format("DD/MM/YYYY");
        showtime.dayOfWeek = moment(showtime.date).format("dddd");
      });
    }

    res.render("client/pages/movie-detail", {
      pageTitle: movieDetail.name,
      breadcrumb: breadcrumb,
      movieDetail: movieDetail,
      cinemaList: cinemaList
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
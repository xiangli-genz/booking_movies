const Category = require("../../models/category.model");
const Movie = require("../../models/movie.model");
const Cinema = require("../../models/cinema.model");
const Booking = require("../../models/booking.model");
const moment = require("moment");

module.exports.detail = async (req, res) => {
  try {
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
  } catch (error) {
    res.redirect("/");
  }
};

module.exports.getBookedSeats = async (req, res) => {
  try {
    const { movieId, cinema, date } = req.query;

    const find = {
      movieId: movieId,
      cinema: cinema,
      deleted: false
    };

    if(date) {
      const startDate = moment(date).startOf("date").toDate();
      const endDate = moment(date).endOf("date").toDate();
      find.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const bookings = await Booking.find(find);

    const bookedSeats = bookings.reduce((acc, booking) => {
      if(booking.seats && booking.seats.length > 0) {
        booking.seats.forEach(seat => {
          acc.push(seat.seatNumber);
        });
      }
      return acc;
    }, []);

    res.json({
      code: "success",
      bookedSeats: bookedSeats
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi khi lấy thông tin ghế"
    });
  }
};

module.exports.news = async (req, res) => {
  res.render("client/pages/news", {
    pageTitle: "Tin Tức"
  })
}
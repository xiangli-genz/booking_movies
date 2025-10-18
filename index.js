const express = require('express')
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const { Tour } = require("./models/tour.model");

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
  });
});

app.get('/tours', async (req, res) => {
  const tourList = await Tour.find({});

  console.log(tourList);

  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tour",
    tourList: tourList
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
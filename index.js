const express = require('express')
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

const tourController  = require("./controllers/client/tour.controller");
const homeController  = require("./controllers/client/home.controller");

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', homeController.home)

app.get('/tours', tourController.list)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
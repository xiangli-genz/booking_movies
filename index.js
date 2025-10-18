const express = require('express')
const path = require('path');
require('dotenv').config();
const database = require('./config/database');

const clientRoutes = require('./routes/client/index.route');
const app = express()
const port = 3000

//kết nối database
database.connect();

//Thiết lập view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Thiết lập thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));

//Thiết lập đường dẫn
app.use('/', clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
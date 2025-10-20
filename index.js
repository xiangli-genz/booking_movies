const express = require('express')
const path = require('path');
require('dotenv').config();
const database = require('./config/database');
const adminRoutes = require('./routes/admin/index.route');
const clientRoutes = require('./routes/client/index.route');
const variablesConfig = require('./config/variable');

const app = express()
const port = 3000

//kết nối database
database.connect();

//Thiết lập view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Thiết lập thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));

//tạo biến cục file pug
app.locals.pathAdmin = variablesConfig.pathAdmin;

//Thiết lập đường dẫn
app.use(`/${variablesConfig.pathAdmin}`, adminRoutes);
app.use('/', clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.tokenUser;

    if (!token) {
      res.redirect(`/user/login`);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;

    const existUser = await User.findOne({
      _id: id,
      email: email,
      status: "active",
      deleted: false
    });

    if (!existUser) {
      res.clearCookie("tokenUser");
      res.redirect(`/user/login`);
      return;
    }

    req.user = existUser;
    res.locals.user = existUser;

    next();
  } catch (error) {
    res.clearCookie("tokenUser");
    res.redirect(`/user/login`);
  }
}

module.exports.checkUserLogin = async (req, res, next) => {
  try {
    const token = req.cookies.tokenUser;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, email } = decoded;

      const existUser = await User.findOne({
        _id: id,
        email: email,
        status: "active",
        deleted: false
      });

      if (existUser) {
        res.locals.user = existUser;
      }
    }

    next();
  } catch (error) {
    next();
  }
}
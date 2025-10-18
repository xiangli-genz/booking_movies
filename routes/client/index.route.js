const router = require("express").Router();
const routRoutes = require("./tour.route");

router.use('/tours', routRoutes);

module.exports = router;
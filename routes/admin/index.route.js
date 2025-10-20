const router = require("express").Router();
const accountRoutes = require("./account.route");
const dashboardRoutes = require("./dashboard.route");
const categoryRoutes = require("./category.route");

router.use("/dashboard", dashboardRoutes);
router.use("/account", accountRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
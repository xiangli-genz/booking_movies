const router = require('express').Router();
const cartController = require("../../controllers/client/cart.controller");
const userAuthMiddleware = require("../../middlewares/client/user-auth.middleware");

router.get('/', cartController.cart);

router.post('/detail', userAuthMiddleware.checkUserLogin, cartController.detail);

router.post('/update', userAuthMiddleware.checkUserLogin, cartController.updateCart);

router.post('/sync', userAuthMiddleware.checkUserLogin, cartController.syncCart);

module.exports = router;
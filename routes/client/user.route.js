const router = require('express').Router();
const multer = require('multer');

const userController = require("../../controllers/client/user.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const authMiddleware = require('../../middlewares/client/user-auth.middleware');

const upload = multer({ storage: cloudinaryHelper.storage });

// Register
router.get('/register', userController.register);
router.post('/register', userController.registerPost);

// Login
router.get('/login', userController.login);
router.post('/login', userController.loginPost);

// Forgot Password
router.get('/forgot-password', userController.forgotPassword);
router.post('/forgot-password', userController.forgotPasswordPost);

// OTP Password
router.get('/otp-password', userController.otpPassword);
router.post('/otp-password', userController.otpPasswordPost);

// Reset Password
router.get('/reset-password', userController.resetPassword);
router.post('/reset-password', authMiddleware.verifyToken, userController.resetPasswordPost);

// Profile (require login)
router.get('/profile', authMiddleware.verifyToken, userController.profile);
router.patch('/profile/edit', authMiddleware.verifyToken, upload.single('avatar'), userController.profileEditPatch);

// Change Password
router.get('/change-password', authMiddleware.verifyToken, userController.changePassword);
router.patch('/change-password', authMiddleware.verifyToken, userController.changePasswordPatch);

// Orders
router.get('/orders', authMiddleware.verifyToken, userController.orders);

// Logout
router.post('/logout', userController.logoutPost);

module.exports = router;
const express = require('express');
const router = express.Router();
const { login, register, verifyOTP, logout, subvendorLogin, getSubvendorPermissions} = require('../controller/authController');
const { verifyToken } = require('../middleware/authmiddleware');


router.post('/vendor/login', login);
router.post('/subvendor/login', subvendorLogin);
router.get('/subvendor/permissions', verifyToken, getSubvendorPermissions);
router.post('/verify-otp', verifyOTP);
router.post('/logout', verifyToken, logout);



// router.post('/vendor/login', authController.login);
// router.post('/subvendor/login', authController.subvendorLogin);
// router.post('/verify-otp', authController.verifyOTP);
// router.get('/subvendor/permissions', authMiddleware, authController.getSubvendorPermissions);
// router.post('/logout', authController.logout);

module.exports = router;
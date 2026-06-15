const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.post('/change-password', protect, authController.changePassword);
router.get('/me', protect, authController.getMe);
router.post('/refresh', authController.refresh);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);


router.get('/user', isAuthenticated, authController.getUserProfile);
router.put('/update-profile', isAuthenticated, authController.updateProfile);

module.exports = router;

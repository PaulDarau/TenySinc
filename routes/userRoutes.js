const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');


const userController = require('../controllers/userController');

router.get('/user-rating/:id', isAuthenticated, userController.getAverageRating);

module.exports = router;

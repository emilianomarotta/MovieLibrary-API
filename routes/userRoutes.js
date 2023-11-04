const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/register', userController.registerUser);
router.post('/login', authController.authenticateUser);
router.post('/logout', authController.logout);


module.exports = router;
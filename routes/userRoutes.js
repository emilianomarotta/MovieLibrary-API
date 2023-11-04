const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const favoriteController = require('../controllers/favoritesController');

router.post('/register', userController.registerUser);
router.post('/login', authController.authenticateUser);
router.post('/logout', authController.logout);
router.post('/addFavorite', authMiddleware, favoriteController.addFavoriteMovie);
router.get('/getFavorites', authMiddleware, favoriteController.getFavoriteMovies);

module.exports = router;
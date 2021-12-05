const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const checkToken = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/signup').post(AuthController.signup);
router.route('/signin').post(AuthController.signin);
router.route('/flights').get(UserController.getFlights);

// must be authenticated
router.use(checkToken.getTokenFromHeader);
router.use(checkToken.restrictTo('user'));

router.route('/book').post(UserController.book);

module.exports = router;
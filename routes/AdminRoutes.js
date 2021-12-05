const express = require('express');
const AdminController = require('../controllers/AdminController');
const checkToken = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * AUTH
 */
router.route('/login').post(AdminController.signin);

// must be authenticated
router.use(checkToken.getTokenFromHeader);
router.use(checkToken.restrictTo('admin'));

/**
 * MANAGE STAFFS
 */
router.route('/staffs')
    .post(AdminController.create)
    .get(AdminController.getAll);

router.route('/staffs/:id')
    .get(AdminController.getOne)
    .patch(AdminController.update)
    .delete(AdminController.delete);


/**
 * MANAGE FLIGHTS
 */
router.route('/flights')
    .post(AdminController.createFlight)
    .get(AdminController.getAllFlight);

router.route('/flights/:id')
    .get(AdminController.getOneFlight)
    .patch(AdminController.updateFlight)
    .delete(AdminController.deleteFlight);


/**
* MANAGE CITIES
*/
router.route('/cities')
    .post(AdminController.createCity)
    .get(AdminController.getAllCity);

router.route('/cities/:id')
    .get(AdminController.getOneCity)
    .patch(AdminController.updateCity)
    .delete(AdminController.deleteCity);


/**
 * MANAGE AIRPLANES
*/
router.route('/airplanes')
    .post(AdminController.createPlane)
    .get(AdminController.getAllPlanes);

router.route('/airplanes/:id')
    .get(AdminController.getOnePlane)
    .patch(AdminController.updatePlane)
    .delete(AdminController.deletePlane);


module.exports = router;
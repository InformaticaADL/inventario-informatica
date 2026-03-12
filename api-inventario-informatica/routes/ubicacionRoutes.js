const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacionController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', ubicacionController.getAllUbicaciones);
router.post('/', protectRouteINF, ubicacionController.createUbicacion);
router.put('/:id', protectRouteINF, ubicacionController.updateUbicacion);
router.delete('/:id', protectRouteINF, ubicacionController.deleteUbicacion);

module.exports = router;

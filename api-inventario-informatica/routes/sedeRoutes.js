const express = require('express');
const router = express.Router();
const sedeController = require('../controllers/sedeController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', sedeController.getAllSedes);
router.post('/', protectRouteINF, sedeController.createSede);
router.put('/:id', protectRouteINF, sedeController.updateSede);
router.delete('/:id', protectRouteINF, sedeController.deleteSede);

module.exports = router;

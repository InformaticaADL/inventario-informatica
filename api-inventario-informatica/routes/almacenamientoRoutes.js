const express = require('express');
const router = express.Router();
const almacenamientoController = require('../controllers/almacenamientoController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', almacenamientoController.getAllAlmacenamiento);
router.post('/', protectRouteINF, almacenamientoController.createAlmacenamiento);
router.put('/:id', protectRouteINF, almacenamientoController.updateAlmacenamiento);
router.delete('/:id', protectRouteINF, almacenamientoController.deleteAlmacenamiento);

module.exports = router;

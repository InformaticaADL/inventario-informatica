const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipoController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', tipoEquipoController.getAllTipoEquipos);
router.post('/', protectRouteINF, tipoEquipoController.createTipoEquipo);
router.put('/:id', protectRouteINF, tipoEquipoController.updateTipoEquipo);
router.delete('/:id', protectRouteINF, tipoEquipoController.deleteTipoEquipo);

module.exports = router;

const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', marcaController.getAllMarcas);
router.post('/', protectRouteINF, marcaController.createMarca);
router.put('/:id', protectRouteINF, marcaController.updateMarca);
router.delete('/:id', protectRouteINF, marcaController.deleteMarca);

module.exports = router;

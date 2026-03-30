const express = require('express');
const router = express.Router();
const marcaImpresoraController = require('../controllers/marcaImpresoraController');
const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', marcaImpresoraController.getAllMarcasImpresoras);
router.post('/', protectRouteINF, marcaImpresoraController.createMarcaImpresora);
router.put('/:id', protectRouteINF, marcaImpresoraController.updateMarcaImpresora);
router.delete('/:id', protectRouteINF, marcaImpresoraController.deleteMarcaImpresora);

module.exports = router;

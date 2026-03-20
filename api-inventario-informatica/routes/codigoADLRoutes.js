const express = require('express');
const router = express.Router();
const codigoADLController = require('../controllers/codigoADLController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', codigoADLController.getAllCodigosADL);
router.post('/', protectRouteINF, codigoADLController.createCodigoADL);
router.put('/:id', protectRouteINF, codigoADLController.updateCodigoADL);
router.delete('/:id', protectRouteINF, codigoADLController.deleteCodigoADL);

module.exports = router;

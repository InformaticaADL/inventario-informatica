const express = require('express');
const router = express.Router();
const tipoEquipoController = require('../controllers/tipoEquipoController');

router.get('/', tipoEquipoController.getAllTipoEquipos);

module.exports = router;

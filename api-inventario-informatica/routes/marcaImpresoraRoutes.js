const express = require('express');
const router = express.Router();
const marcaImpresoraController = require('../controllers/marcaImpresoraController');

router.get('/', marcaImpresoraController.getAllMarcasImpresoras);

module.exports = router;

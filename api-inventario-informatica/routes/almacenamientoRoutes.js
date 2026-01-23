const express = require('express');
const router = express.Router();
const almacenamientoController = require('../controllers/almacenamientoController');

router.get('/', almacenamientoController.getAllAlmacenamiento);

module.exports = router;

const express = require('express');
const router = express.Router();
const sedeController = require('../controllers/sedeController');

router.get('/', sedeController.getAllSedes);

module.exports = router;

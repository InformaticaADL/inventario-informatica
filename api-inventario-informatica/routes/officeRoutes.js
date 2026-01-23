const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');

router.get('/', officeController.getAllOffice);

module.exports = router;

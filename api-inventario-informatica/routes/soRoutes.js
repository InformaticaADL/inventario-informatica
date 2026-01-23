const express = require('express');
const router = express.Router();
const soController = require('../controllers/soController');

router.get('/', soController.getAllSo);

module.exports = router;

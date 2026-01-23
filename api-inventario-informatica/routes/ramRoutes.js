const express = require('express');
const router = express.Router();
const ramController = require('../controllers/ramController');

router.get('/', ramController.getAllRam);

module.exports = router;

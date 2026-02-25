const express = require('express');
const router = express.Router();
const clavesWifiController = require('../controllers/clavesWifiController');

router.get('/', clavesWifiController.getAllClaves);
router.post('/', clavesWifiController.createClave);
router.put('/:id', clavesWifiController.updateClave);
router.delete('/:id', clavesWifiController.deleteClave);

module.exports = router;

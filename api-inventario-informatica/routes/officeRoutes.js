const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', officeController.getAllOffice);
router.post('/', protectRouteINF, officeController.createOffice);
router.put('/:id', protectRouteINF, officeController.updateOffice);
router.delete('/:id', protectRouteINF, officeController.deleteOffice);

module.exports = router;

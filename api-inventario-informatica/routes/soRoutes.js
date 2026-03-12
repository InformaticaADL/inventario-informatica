const express = require('express');
const router = express.Router();
const soController = require('../controllers/soController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', soController.getAllSo);
router.post('/', protectRouteINF, soController.createSo);
router.put('/:id', protectRouteINF, soController.updateSo);
router.delete('/:id', protectRouteINF, soController.deleteSo);

module.exports = router;

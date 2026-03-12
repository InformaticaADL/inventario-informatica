const express = require('express');
const router = express.Router();
const ramController = require('../controllers/ramController');

const protectRouteINF = require('../middlewares/protectRouteINF');

router.get('/', ramController.getAllRam);
router.post('/', protectRouteINF, ramController.createRam);
router.put('/:id', protectRouteINF, ramController.updateRam);
router.delete('/:id', protectRouteINF, ramController.deleteRam);

module.exports = router;

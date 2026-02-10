const express = require('express');
const router = express.Router();
const correosADLController = require('../controllers/correosADLController');

router.get('/', correosADLController.getAllCorreos);
router.post('/', correosADLController.createCorreo);
router.put('/:id', correosADLController.updateCorreo);
router.delete('/:id', correosADLController.deleteCorreo);

module.exports = router;

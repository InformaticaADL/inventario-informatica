const express = require('express');
const router = express.Router();
const mantencionController = require('../controllers/mantencionController');

router.get('/', mantencionController.getAllMantenciones);
router.post('/', mantencionController.createMantencion);
router.put('/:id', mantencionController.updateMantencion);
router.delete('/:id', mantencionController.deleteMantencion);

module.exports = router;

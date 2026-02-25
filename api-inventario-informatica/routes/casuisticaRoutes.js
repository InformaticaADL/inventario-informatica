const express = require('express');
const router = express.Router();
const casuisticaController = require('../controllers/casuisticaController');

router.get('/', casuisticaController.getAllCasuisticas);
router.post('/', casuisticaController.createCasuistica);
router.put('/:id', casuisticaController.updateCasuistica);
router.delete('/:id', casuisticaController.deleteCasuistica);

module.exports = router;

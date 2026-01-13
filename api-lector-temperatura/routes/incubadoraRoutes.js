const express = require('express');
const router = express.Router(); // 1. Inicializar el router

const protectRouteINF = require('../middlewares/protectRouteINF');
const incubadoraController = require('../controllers/incubadoraController');

// 2. Definir la ruta
// Si usaste la Opción 1 (app.use('/api/incubadora')), deja esto así:
router.post('/consolidar', protectRouteINF, incubadoraController.consolidar);
router.get('/list', protectRouteINF, incubadoraController.getIncubadoras);
router.get('/history/:incubadora_id', protectRouteINF, incubadoraController.getIncubadoraHistory);

// 3. Exportar el router
module.exports = router;
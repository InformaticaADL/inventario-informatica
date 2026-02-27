const express = require('express');
const router = express.Router();
const aplicacionController = require('../controllers/aplicacionController');
// no middleware imported yet

router.get('/', /*verifyToken,*/ aplicacionController.getAplicaciones);
router.get('/:id', /*verifyToken,*/ aplicacionController.getAplicacionById);
router.post('/', /*verifyToken,*/ aplicacionController.createAplicacion);
router.put('/:id', /*verifyToken,*/ aplicacionController.updateAplicacion);
router.delete('/:id', /*verifyToken,*/ aplicacionController.deleteAplicacion);

module.exports = router;

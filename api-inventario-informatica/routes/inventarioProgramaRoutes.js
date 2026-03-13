const express = require("express");
const router = express.Router();
const inventarioProgramaController = require("../controllers/inventarioProgramaController");
const protectRouteINF = require("../middlewares/protectRouteINF");

// Obtener programas asociados a un equipo
router.get("/:id_inventario", inventarioProgramaController.getProgramasByInventario);

// Rutas protegidas para asociación (Solo INF y GER)
router.post("/asociar", protectRouteINF, inventarioProgramaController.associateProgramas);
router.post("/asociar-seccion", protectRouteINF, inventarioProgramaController.associateProgramasBySeccion);
router.delete("/:id_inventario/:id_programa", protectRouteINF, inventarioProgramaController.dissociatePrograma);

module.exports = router;

const express = require("express");
const router = express.Router();
const programaController = require("../controllers/programaController");
const protectRouteINF = require("../middlewares/protectRouteINF");

// Obtener todos los programas (abierto para lectura inicial)
router.get("/", programaController.getAllProgramas);

// Rutas protegidas para edición (Solo INF y GER)
router.post("/", protectRouteINF, programaController.createPrograma);
router.put("/:id", protectRouteINF, programaController.updatePrograma);
router.delete("/:id", protectRouteINF, programaController.deletePrograma);

module.exports = router;

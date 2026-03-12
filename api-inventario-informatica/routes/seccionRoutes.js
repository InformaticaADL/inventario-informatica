const express = require("express");
const seccionController = require("../controllers/seccionController");
const protectRouteINF = require("../middlewares/protectRouteINF");

const router = express.Router();

router.get("/", seccionController.getAllSecciones);
router.post("/", protectRouteINF, seccionController.createSeccion);
router.put("/:id", protectRouteINF, seccionController.updateSeccion);
router.delete("/:id", protectRouteINF, seccionController.deleteSeccion);

module.exports = router;

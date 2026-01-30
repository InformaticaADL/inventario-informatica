const express = require("express");
const {
    getInventario,
    createInventario,
    updateInventario,
    deleteInventario
} = require("../controllers/inventarioController");
// Assuming we might want auth here later, but for now we keep it open or use existing middleware if needed
// const protectRoute = require("../middlewares/protectRoute"); 

const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

// Todas las rutas de inventario requieren estar logueado
router.use(protect);

// GET: Permitido para todos los roles logueados (INF y GER)
router.get("/", getInventario);

// Modificaciones: Solo permitido para INF
router.post("/", restrictTo("INF"), createInventario);
router.put("/:id", restrictTo("INF"), updateInventario);
router.delete("/:id", restrictTo("INF"), deleteInventario);

module.exports = router;

const express = require("express");
const {
    getInventario,
    createInventario,
    updateInventario,
    deleteInventario
} = require("../controllers/inventarioController");
// Assuming we might want auth here later, but for now we keep it open or use existing middleware if needed
// const protectRoute = require("../middlewares/protectRoute"); 

const router = express.Router();

router.get("/", getInventario);
router.post("/", createInventario);
router.put("/:id", updateInventario);
router.delete("/:id", deleteInventario);

module.exports = router;

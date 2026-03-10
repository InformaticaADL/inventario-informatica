const express = require("express");
const router = express.Router();
const impresoraController = require("../controllers/impresoraController");

router.get("/", impresoraController.getAll);
router.get("/:id", impresoraController.getOne);
router.post("/", impresoraController.create);
router.put("/:id", impresoraController.update);
router.delete("/:id", impresoraController.delete);

module.exports = router;

const express = require("express");
const { getAllSecciones } = require("../controllers/seccionController");

const router = express.Router();

router.get("/", getAllSecciones);

module.exports = router;

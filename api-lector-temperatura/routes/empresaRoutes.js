const express = require("express");
const {getEmpresaList} = require("../controllers/empresaController");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.get("/", getEmpresaList);

module.exports = router
const express = require("express");
const {getCentroList} = require("../controllers/centroController")

const router = express.Router();

router.get("/", getCentroList);

module.exports = router
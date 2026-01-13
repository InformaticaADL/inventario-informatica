const express = require("express");
const {getSedeList} = require("../controllers/sedeController")

const router = express.Router();

router.get("/", getSedeList);

module.exports = router
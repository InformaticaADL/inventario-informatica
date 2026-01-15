const express = require("express");
const {getUsuarioList, loginUser, validarToken} = require("../controllers/usuarioController");
const protectRoute = require("../middlewares/protectRoute");

const router = express.Router();

router.get("/", getUsuarioList);
router.post("/login", loginUser);
router.get("/validar-token", protectRoute, validarToken);

module.exports = router
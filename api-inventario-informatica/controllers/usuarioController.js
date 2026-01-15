// const Usuario = require("../models/Usuario");
const db = require("../models");
const { Usuario } = db;

require("dotenv").config();
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const getUsuarioList = async (req, res) => {
  try {
    const data = await Usuario.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener :", error);
    res.status(500).json({ error: "Ocurrió un error" });
  }
};

// Almacena los intentos de inicio de sesión fallidos y el bloqueo temporal
const loginAttempts = {};

const loginUser = async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;
  try {
    const user = await Usuario.findOne({ where: { nombre_usuario } });

    if (!user) {
      return res.status(401).send("Usuario no existe");
    }

    // Obtener clave única para el usuario (ej. id o nombre de usuario)
    const userKey = `${user.id_usuario}`;

    if (user.clave_usuario != contraseña) {
      // Si no existe un registro en memoria, crearlo
      if (!loginAttempts[userKey]) {
        loginAttempts[userKey] = { attempts: 0, lockedUntil: null };
      }

      // Incrementar los intentos fallidos
      loginAttempts[userKey].attempts += 1;

      // Bloquear el usuario si los intentos fallidos son >= 3
      if (loginAttempts[userKey].attempts >= 3) {
        loginAttempts[userKey].lockedUntil = Date.now() + 5 * 60 * 1000; // 5 minutos
        return res
          .status(403)
          .send(
            "Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos."
          );
      }
      return res.status(401).send("Credenciales inválidas");
    }


    // Verificar si está bloqueado
    if (
      loginAttempts[userKey] &&
      loginAttempts[userKey].lockedUntil > Date.now()
    ) {
      return res
        .status(403)
        .send(`Cuenta bloqueada. Inténtelo más tarde.`);
    }

    // Resetear los intentos fallidos tras un inicio de sesión exitoso
    if (loginAttempts[userKey]) {
      loginAttempts[userKey] = { attempts: 0, lockedUntil: null };
    }

    // Generar el token y responder
    const token = jwt.sign(
      {
        id: user.id_usuario,
        seccion: user.seccion,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      seccion: user.seccion,
      username: user.usuario,
      id_usuario: user.id_usuario,
      email: user.correo_electronico
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Query execution failed");
  }
};

const validarToken = async (req, res) => {
  res.status(200).send("Ok");
}

module.exports = { getUsuarioList, loginUser, validarToken };

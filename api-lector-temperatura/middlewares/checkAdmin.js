
const Usuario = require('../models/Usuario');

const checkAdmin = async (req, res, next) => {
  const idUsuario = req.query.id_usuario;

  if (!idUsuario) {
    return res.status(400).json({ message: "ID de usuario es requerido" });
  }

  try {
    const user = await Usuario.findByPk(idUsuario);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.admin) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = checkAdmin;

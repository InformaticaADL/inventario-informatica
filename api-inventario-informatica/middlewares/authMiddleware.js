const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        // Permitir que continúe si no es estricto? No, queremos proteger.
        // Pero inventarioRoutes antes no tenía auth.
        // Si el cliente no manda token, fallará aquí.
        return res.status(401).json({ error: "No autorizado, no hay token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; // { id: ..., seccion: ... }
        next();
    } catch (error) {
        console.error("Error validando token:", error);
        return res.status(401).json({ error: "Token no válido" });
    }
};

const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user debe haber sido seteado por 'protect'
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado para verificar roles" });
        }

        if (!allowedRoles.includes(req.user.seccion)) {
            return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
        }
        next();
    };
};

module.exports = { protect, restrictTo };

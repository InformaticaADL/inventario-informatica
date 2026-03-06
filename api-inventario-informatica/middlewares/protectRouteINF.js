const jwt = require('jsonwebtoken');
require('dotenv').config();

const protectRouteINF = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // --- DEBUG LOGS (Borrar después) ---
    console.log("🔍 Middleware INF - Header recibido:", authHeader);
    console.log("🔑 Usando llave secreta:", process.env.JWT_KEY ? "Existe (No la imprimas)" : "❌ INDEFINIDA");
    // -----------------------------------

    if (!authHeader) {
        console.log("❌ Rechazado: No hay header Authorization"); // Log extra
        return res.status(401).json({
            success: false,
            message: 'Es necesario un token de acceso.'
        });
    }

    // Verificar que el header tenga el formato correcto "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Formato de token incorrecto. Use: Bearer <token>'
        });
    }

    const token = parts[1];

    // Verificar que el token no esté vacío
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado.'
        });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Log de éxito con datos decodificados
        console.log("✅ Token verificado. Usuario:", decoded.nombre_usuario, "Sección:", decoded.seccion);

        // Verificar que la sección sea "INF" o "GER"
        if (decoded.seccion !== 'INF' && decoded.seccion !== 'GER') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No tienes permisos para acceder a recursos de las unidades INF o GER.'
            });
        }

        // Pasar el usuario decodificado a la solicitud
        req.user = decoded;

        // Continuar con la siguiente función en la cadena
        next();
    } catch (error) {
        // Log detallado del error
        console.log('❌ Error al verificar token:', error.message);

        // Manejar diferentes tipos de errores de JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido.'
            });
        }

        // Para otros errores inesperados
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al validar token.'
        });
    }
};

module.exports = protectRouteINF;
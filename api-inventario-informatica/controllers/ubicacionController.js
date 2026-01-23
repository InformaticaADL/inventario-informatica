const { Ubicacion } = require('../models');

const getAllUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            order: [['nombre_ubicacion', 'ASC']]
        });
        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
        res.status(500).json({ message: "Error al obtener las ubicaciones", error: error.message });
    }
};

module.exports = {
    getAllUbicaciones
};

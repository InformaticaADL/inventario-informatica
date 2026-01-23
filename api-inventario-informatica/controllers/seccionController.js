const { Seccion } = require('../models');

const getAllSecciones = async (req, res) => {
    try {
        const secciones = await Seccion.findAll({
            order: [['nombre_seccion', 'ASC']]
        });
        res.status(200).json(secciones);
    } catch (error) {
        console.error("Error al obtener secciones:", error);
        res.status(500).json({ message: "Error al obtener las secciones", error: error.message });
    }
};

module.exports = {
    getAllSecciones
};

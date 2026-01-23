const { Sede } = require('../models');

const getAllSedes = async (req, res) => {
    try {
        const sedes = await Sede.findAll({
            order: [['nombre_lugaranalisis', 'ASC']]
        });
        res.status(200).json(sedes);
    } catch (error) {
        console.error("Error al obtener sedes:", error);
        res.status(500).json({ message: "Error al obtener las sedes", error: error.message });
    }
};

module.exports = {
    getAllSedes
};

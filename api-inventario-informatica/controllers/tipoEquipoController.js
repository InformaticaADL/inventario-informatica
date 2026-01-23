const { TipoEquipo } = require('../models');

const getAllTipoEquipos = async (req, res) => {
    try {
        const tipos = await TipoEquipo.findAll({
            order: [['nombre_tipoequipo', 'ASC']]
        });
        res.status(200).json(tipos);
    } catch (error) {
        console.error("Error al obtener tipos de equipo:", error);
        res.status(500).json({ message: "Error al obtener los tipos de equipo", error: error.message });
    }
};

module.exports = {
    getAllTipoEquipos
};

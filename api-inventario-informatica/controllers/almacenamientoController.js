const { Almacenamiento } = require('../models');

const getAllAlmacenamiento = async (req, res) => {
    try {
        const almacenamientos = await Almacenamiento.findAll({
            order: [['almacenamiento', 'ASC']]
        });
        res.status(200).json(almacenamientos);
    } catch (error) {
        console.error("Error al obtener almacenamiento:", error);
        res.status(500).json({ message: "Error al obtener almacenamiento", error: error.message });
    }
};

module.exports = {
    getAllAlmacenamiento
};

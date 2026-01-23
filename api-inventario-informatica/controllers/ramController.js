const { Ram } = require('../models');

const getAllRam = async (req, res) => {
    try {
        const ram = await Ram.findAll({
            order: [['capacidad', 'ASC']]
        });
        res.status(200).json(ram);
    } catch (error) {
        console.error("Error al obtener ram:", error);
        res.status(500).json({ message: "Error al obtener las ram", error: error.message });
    }
};

module.exports = {
    getAllRam
};

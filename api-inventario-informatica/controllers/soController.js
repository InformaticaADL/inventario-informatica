const { So } = require('../models');

const getAllSo = async (req, res) => {
    try {
        const sos = await So.findAll({
            order: [['so', 'ASC']]
        });
        res.status(200).json(sos);
    } catch (error) {
        console.error("Error al obtener sistemas operativos:", error);
        res.status(500).json({ message: "Error al obtener los sistemas operativos", error: error.message });
    }
};

module.exports = {
    getAllSo
};

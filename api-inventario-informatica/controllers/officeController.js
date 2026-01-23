const { Office } = require('../models');

const getAllOffice = async (req, res) => {
    try {
        const offices = await Office.findAll({
            order: [['office', 'ASC']]
        });
        res.status(200).json(offices);
    } catch (error) {
        console.error("Error al obtener versiones de office:", error);
        res.status(500).json({ message: "Error al obtener las versiones de office", error: error.message });
    }
};

module.exports = {
    getAllOffice
};

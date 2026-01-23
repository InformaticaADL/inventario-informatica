const { Marca } = require('../models');

const getAllMarcas = async (req, res) => {
    try {
        const marcas = await Marca.findAll({
            order: [['nombre_marca', 'ASC']]
        });
        res.status(200).json(marcas);
    } catch (error) {
        console.error("Error al obtener marcas:", error);
        res.status(500).json({ message: "Error al obtener las marcas", error: error.message });
    }
};

module.exports = {
    getAllMarcas
};

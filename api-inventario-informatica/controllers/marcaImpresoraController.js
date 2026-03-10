const { MarcaImpresora } = require('../models');

const getAllMarcasImpresoras = async (req, res) => {
    try {
        const marcas = await MarcaImpresora.findAll({
            order: [['nombre_marca', 'ASC']]
        });
        res.status(200).json(marcas);
    } catch (error) {
        console.error("Error al obtener marcas de impresoras:", error);
        res.status(500).json({ message: "Error al obtener las marcas de impresoras", error: error.message });
    }
};

module.exports = {
    getAllMarcasImpresoras
};

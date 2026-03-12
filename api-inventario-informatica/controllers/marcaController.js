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

const createMarca = async (req, res) => {
    try {
        const maxId = await Marca.max('id_marca');
        const nextId = (maxId || 0) + 1;

        const marca = await Marca.create({
            ...req.body,
            id_marca: nextId
        });
        res.status(201).json(marca);
    } catch (error) {
        console.error("Error al crear marca:", error);
        res.status(500).json({ message: "Error al crear la marca", error: error.message });
    }
};

const updateMarca = async (req, res) => {
    try {
        const { id } = req.params;
        await Marca.update(req.body, { where: { id_marca: id } });
        res.status(200).json({ message: "Marca actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar marca:", error);
        res.status(500).json({ message: "Error al actualizar la marca", error: error.message });
    }
};

const deleteMarca = async (req, res) => {
    try {
        const { id } = req.params;
        await Marca.destroy({ where: { id_marca: id } });
        res.status(200).json({ message: "Marca eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar marca:", error);
        res.status(500).json({ message: "Error al eliminar la marca", error: error.message });
    }
};

module.exports = {
    getAllMarcas,
    createMarca,
    updateMarca,
    deleteMarca
};

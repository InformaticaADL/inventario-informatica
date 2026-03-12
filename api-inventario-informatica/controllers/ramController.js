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

const createRam = async (req, res) => {
    try {
        // Encontrar el ID más alto actual
        const maxId = await Ram.max('id_ram');
        const nextId = (maxId || 0) + 1;
        
        const ram = await Ram.create({
            ...req.body,
            id_ram: nextId
        });
        res.status(201).json(ram);
    } catch (error) {
        console.error("Error al crear ram:", error);
        res.status(500).json({ message: "Error al crear la ram", error: error.message });
    }
};

const updateRam = async (req, res) => {
    try {
        const { id } = req.params;
        await Ram.update(req.body, { where: { id_ram: id } });
        res.status(200).json({ message: "Ram actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar ram:", error);
        res.status(500).json({ message: "Error al actualizar la ram", error: error.message });
    }
};

const deleteRam = async (req, res) => {
    try {
        const { id } = req.params;
        await Ram.destroy({ where: { id_ram: id } });
        res.status(200).json({ message: "Ram eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar ram:", error);
        res.status(500).json({ message: "Error al eliminar la ram", error: error.message });
    }
};

module.exports = {
    getAllRam,
    createRam,
    updateRam,
    deleteRam
};

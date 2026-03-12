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

const createAlmacenamiento = async (req, res) => {
    try {
        const maxId = await Almacenamiento.max('id_almacenamiento');
        const nextId = (maxId || 0) + 1;

        const almacenamiento = await Almacenamiento.create({
            ...req.body,
            id_almacenamiento: nextId
        });
        res.status(201).json(almacenamiento);
    } catch (error) {
        console.error("Error al crear almacenamiento:", error);
        res.status(500).json({ message: "Error al crear el almacenamiento", error: error.message });
    }
};

const updateAlmacenamiento = async (req, res) => {
    try {
        const { id } = req.params;
        await Almacenamiento.update(req.body, { where: { id_almacenamiento: id } });
        res.status(200).json({ message: "Almacenamiento actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar almacenamiento:", error);
        res.status(500).json({ message: "Error al actualizar el almacenamiento", error: error.message });
    }
};

const deleteAlmacenamiento = async (req, res) => {
    try {
        const { id } = req.params;
        await Almacenamiento.destroy({ where: { id_almacenamiento: id } });
        res.status(200).json({ message: "Almacenamiento eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar almacenamiento:", error);
        res.status(500).json({ message: "Error al eliminar el almacenamiento", error: error.message });
    }
};

module.exports = {
    getAllAlmacenamiento,
    createAlmacenamiento,
    updateAlmacenamiento,
    deleteAlmacenamiento
};

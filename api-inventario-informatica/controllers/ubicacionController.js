const { Ubicacion } = require('../models');

const getAllUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            order: [['nombre_ubicacion', 'ASC']]
        });
        res.status(200).json(ubicaciones);
    } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
        res.status(500).json({ message: "Error al obtener las ubicaciones", error: error.message });
    }
};

const createUbicacion = async (req, res) => {
    try {
        const maxId = await Ubicacion.max('id_ubicacion');
        const nextId = (maxId || 0) + 1;

        const ubicacion = await Ubicacion.create({
            ...req.body,
            id_ubicacion: nextId
        });
        res.status(201).json(ubicacion);
    } catch (error) {
        console.error("Error al crear ubicación:", error);
        res.status(500).json({ message: "Error al crear la ubicación", error: error.message });
    }
};

const updateUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Ubicacion.update(req.body, { where: { id_ubicacion: id } });
        res.status(200).json({ message: "Ubicación actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar ubicación:", error);
        res.status(500).json({ message: "Error al actualizar la ubicación", error: error.message });
    }
};

const deleteUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        await Ubicacion.destroy({ where: { id_ubicacion: id } });
        res.status(200).json({ message: "Ubicación eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar ubicación:", error);
        res.status(500).json({ message: "Error al eliminar la ubicación", error: error.message });
    }
};

module.exports = {
    getAllUbicaciones,
    createUbicacion,
    updateUbicacion,
    deleteUbicacion
};

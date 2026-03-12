const { Sede } = require('../models');

const getAllSedes = async (req, res) => {
    try {
        const sedes = await Sede.findAll({
            order: [['nombre_lugaranalisis', 'ASC']]
        });
        res.status(200).json(sedes);
    } catch (error) {
        console.error("Error al obtener sedes:", error);
        res.status(500).json({ message: "Error al obtener las sedes", error: error.message });
    }
};

const createSede = async (req, res) => {
    try {
        const maxId = await Sede.max('id_lugaranalisis');
        const nextId = (maxId || 0) + 1;

        const sede = await Sede.create({
            ...req.body,
            id_lugaranalisis: nextId
        });
        res.status(201).json(sede);
    } catch (error) {
        console.error("Error al crear sede:", error);
        res.status(500).json({ message: "Error al crear la sede", error: error.message });
    }
};

const updateSede = async (req, res) => {
    try {
        const { id } = req.params;
        await Sede.update(req.body, { where: { id_lugaranalisis: id } });
        res.status(200).json({ message: "Sede actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar sede:", error);
        res.status(500).json({ message: "Error al actualizar la sede", error: error.message });
    }
};

const deleteSede = async (req, res) => {
    try {
        const { id } = req.params;
        await Sede.destroy({ where: { id_lugaranalisis: id } });
        res.status(200).json({ message: "Sede eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar sede:", error);
        res.status(500).json({ message: "Error al eliminar la sede", error: error.message });
    }
};

module.exports = {
    getAllSedes,
    createSede,
    updateSede,
    deleteSede
};

const { TipoEquipo } = require('../models');

const getAllTipoEquipos = async (req, res) => {
    try {
        const tipos = await TipoEquipo.findAll({
            order: [['nombre_tipoequipo', 'ASC']]
        });
        res.status(200).json(tipos);
    } catch (error) {
        console.error("Error al obtener tipos de equipo:", error);
        res.status(500).json({ message: "Error al obtener los tipos de equipo", error: error.message });
    }
};

const createTipoEquipo = async (req, res) => {
    try {
        const maxId = await TipoEquipo.max('id_tipoequipo');
        const nextId = (maxId || 0) + 1;

        const tipo = await TipoEquipo.create({
            ...req.body,
            id_tipoequipo: nextId
        });
        res.status(201).json(tipo);
    } catch (error) {
        console.error("Error al crear tipo de equipo:", error);
        res.status(500).json({ message: "Error al crear el tipo de equipo", error: error.message });
    }
};

const updateTipoEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        await TipoEquipo.update(req.body, { where: { id_tipoequipo: id } });
        res.status(200).json({ message: "Tipo de equipo actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar tipo de equipo:", error);
        res.status(500).json({ message: "Error al actualizar el tipo de equipo", error: error.message });
    }
};

const deleteTipoEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        await TipoEquipo.destroy({ where: { id_tipoequipo: id } });
        res.status(200).json({ message: "Tipo de equipo eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar tipo de equipo:", error);
        res.status(500).json({ message: "Error al eliminar el tipo de equipo", error: error.message });
    }
};

module.exports = {
    getAllTipoEquipos,
    createTipoEquipo,
    updateTipoEquipo,
    deleteTipoEquipo
};

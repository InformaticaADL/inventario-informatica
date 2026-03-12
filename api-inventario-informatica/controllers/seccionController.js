const { Seccion } = require('../models');

const getAllSecciones = async (req, res) => {
    try {
        const secciones = await Seccion.findAll({
            order: [['nombre_seccion', 'ASC']]
        });
        res.status(200).json(secciones);
    } catch (error) {
        console.error("Error al obtener secciones:", error);
        res.status(500).json({ message: "Error al obtener las secciones", error: error.message });
    }
};

const createSeccion = async (req, res) => {
    try {
        const maxId = await Seccion.max('id_seccion');
        const nextId = (maxId || 0) + 1;

        const seccion = await Seccion.create({
            ...req.body,
            id_seccion: nextId
        });
        res.status(201).json(seccion);
    } catch (error) {
        console.error("Error al crear sección:", error);
        res.status(500).json({ message: "Error al crear la sección", error: error.message });
    }
};

const updateSeccion = async (req, res) => {
    try {
        const { id } = req.params;
        await Seccion.update(req.body, { where: { id_seccion: id } });
        res.status(200).json({ message: "Sección actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar sección:", error);
        res.status(500).json({ message: "Error al actualizar la sección", error: error.message });
    }
};

const deleteSeccion = async (req, res) => {
    try {
        const { id } = req.params;
        await Seccion.destroy({ where: { id_seccion: id } });
        res.status(200).json({ message: "Sección eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar sección:", error);
        res.status(500).json({ message: "Error al eliminar la sección", error: error.message });
    }
};

module.exports = {
    getAllSecciones,
    createSeccion,
    updateSeccion,
    deleteSeccion
};

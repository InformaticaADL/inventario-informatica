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

const createOffice = async (req, res) => {
    try {
        const maxId = await Office.max('id_office');
        const nextId = (maxId || 0) + 1;

        const office = await Office.create({
            ...req.body,
            id_office: nextId
        });
        res.status(201).json(office);
    } catch (error) {
        console.error("Error al crear Office:", error);
        res.status(500).json({ message: "Error al crear Office", error: error.message });
    }
};

const updateOffice = async (req, res) => {
    try {
        const { id } = req.params;
        await Office.update(req.body, { where: { id_office: id } });
        res.status(200).json({ message: "Office actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar Office:", error);
        res.status(500).json({ message: "Error al actualizar Office", error: error.message });
    }
};

const deleteOffice = async (req, res) => {
    try {
        const { id } = req.params;
        await Office.destroy({ where: { id_office: id } });
        res.status(200).json({ message: "Office eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar Office:", error);
        res.status(500).json({ message: "Error al eliminar Office", error: error.message });
    }
};

module.exports = {
    getAllOffice,
    createOffice,
    updateOffice,
    deleteOffice
};

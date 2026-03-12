const { So } = require('../models');

const getAllSo = async (req, res) => {
    try {
        const sos = await So.findAll({
            order: [['so', 'ASC']]
        });
        res.status(200).json(sos);
    } catch (error) {
        console.error("Error al obtener sistemas operativos:", error);
        res.status(500).json({ message: "Error al obtener los sistemas operativos", error: error.message });
    }
};

const createSo = async (req, res) => {
    try {
        const maxId = await So.max('id_so');
        const nextId = (maxId || 0) + 1;

        const so = await So.create({
            ...req.body,
            id_so: nextId
        });
        res.status(201).json(so);
    } catch (error) {
        console.error("Error al crear S.O.:", error);
        res.status(500).json({ message: "Error al crear el S.O.", error: error.message });
    }
};

const updateSo = async (req, res) => {
    try {
        const { id } = req.params;
        await So.update(req.body, { where: { id_so: id } });
        res.status(200).json({ message: "S.O. actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar S.O.:", error);
        res.status(500).json({ message: "Error al actualizar el S.O.", error: error.message });
    }
};

const deleteSo = async (req, res) => {
    try {
        const { id } = req.params;
        await So.destroy({ where: { id_so: id } });
        res.status(200).json({ message: "S.O. eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar S.O.:", error);
        res.status(500).json({ message: "Error al eliminar el S.O.", error: error.message });
    }
};

module.exports = {
    getAllSo,
    createSo,
    updateSo,
    deleteSo
};

const db = require("../models");
const { Inventario } = db;
const { Op } = require("sequelize");

const getInventario = async (req, res) => {
    try {
        const data = await Inventario.findAll({
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const createInventario = async (req, res) => {
    try {
        const newItem = await Inventario.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating inventory item:", error);
        res.status(500).json({ error: "Error al crear el registro" });
    }
};

const updateInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Inventario.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        await item.update(req.body);
        res.status(200).json(item);
    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(500).json({ error: "Error al actualizar el registro" });
    }
};

const deleteInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Inventario.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        await item.destroy();
        res.status(200).json({ message: "Registro eliminado correctamente" });
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).json({ error: "Error al eliminar el registro" });
    }
};

module.exports = {
    getInventario,
    createInventario,
    updateInventario,
    deleteInventario
};

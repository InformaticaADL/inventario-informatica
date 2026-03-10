const { Impresora } = require("../models");

exports.getAll = async (req, res) => {
    try {
        const data = await Impresora.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Impresora.findByPk(id);
        if (!data) return res.status(404).json({ message: "No encontrado" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const data = await Impresora.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Impresora.update(req.body, {
            where: { id_impresora: id }
        });
        if (updated) {
            const updatedData = await Impresora.findByPk(id);
            return res.json(updatedData);
        }
        throw new Error('Impresora no encontrada');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Impresora.destroy({
            where: { id_impresora: id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Impresora no encontrada');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

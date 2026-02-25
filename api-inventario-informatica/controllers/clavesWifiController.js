const { ClavesWifi } = require('../models');

exports.getAllClaves = async (req, res) => {
    try {
        const claves = await ClavesWifi.findAll({
            order: [['id_clave', 'DESC']]
        });
        res.json(claves);
    } catch (error) {
        console.error("Error al obtener claves wifi:", error);
        res.status(500).json({ message: "Error al obtener claves", error: error.message });
    }
};

exports.createClave = async (req, res) => {
    try {
        const newClave = await ClavesWifi.create(req.body);
        res.status(201).json(newClave);
    } catch (error) {
        console.error("Error al crear clave:", error);
        res.status(500).json({ message: "Error al crear clave", error: error.message });
    }
};

exports.updateClave = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ClavesWifi.update(req.body, {
            where: { id_clave: id }
        });
        if (updated) {
            const updatedClave = await ClavesWifi.findByPk(id);
            res.status(200).json(updatedClave);
        } else {
            res.status(404).json({ message: "Clave no encontrada" });
        }
    } catch (error) {
        console.error("Error al actualizar clave:", error);
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

exports.deleteClave = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ClavesWifi.destroy({
            where: { id_clave: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Clave no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar clave:", error);
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};

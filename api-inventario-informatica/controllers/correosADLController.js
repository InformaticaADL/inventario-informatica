const { CorreosADL } = require('../models');

exports.getAllCorreos = async (req, res) => {
    try {
        const correos = await CorreosADL.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(correos);
    } catch (error) {
        console.error("Error al obtener correos:", error);
        res.status(500).json({ message: "Error al obtener correos", error: error.message });
    }
};

exports.createCorreo = async (req, res) => {
    try {
        const newCorreo = await CorreosADL.create(req.body);
        res.status(201).json(newCorreo);
    } catch (error) {
        console.error("Error al crear correo:", error);
        res.status(500).json({ message: "Error al crear correo", error: error.message });
    }
};

exports.updateCorreo = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await CorreosADL.update(req.body, {
            where: { id_correo: id }
        });
        if (updated) {
            const updatedCorreo = await CorreosADL.findByPk(id);
            res.status(200).json(updatedCorreo);
        } else {
            res.status(404).json({ message: "Correo no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar correo:", error);
        res.status(500).json({ message: "Error al actualizar correo", error: error.message });
    }
};

exports.deleteCorreo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await CorreosADL.destroy({
            where: { id_correo: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Correo no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar correo:", error);
        res.status(500).json({ message: "Error al eliminar correo", error: error.message });
    }
};

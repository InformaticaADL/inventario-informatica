const { Mantencion } = require('../models');

exports.getAllMantenciones = async (req, res) => {
    try {
        const mantenciones = await Mantencion.findAll({
            order: [['id_mantencion', 'DESC']]
        });
        res.json(mantenciones);
    } catch (error) {
        console.error("Error al obtener mantenciones:", error);
        res.status(500).json({ message: "Error al obtener mantenciones", error: error.message });
    }
};

exports.createMantencion = async (req, res) => {
    try {
        const newMantencion = await Mantencion.create(req.body);
        res.status(201).json(newMantencion);
    } catch (error) {
        console.error("Error al crear mantencion:", error);
        res.status(500).json({ message: "Error al crear mantencion", error: error.message });
    }
};

exports.updateMantencion = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Mantencion.update(req.body, {
            where: { id_mantencion: id }
        });
        if (updated) {
            const updatedMantencion = await Mantencion.findByPk(id);
            res.status(200).json(updatedMantencion);
        } else {
            res.status(404).json({ message: "Mantencion no encontrada" });
        }
    } catch (error) {
        console.error("Error al actualizar mantencion:", error);
        res.status(500).json({ message: "Error al actualizar mantencion", error: error.message });
    }
};

exports.deleteMantencion = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Mantencion.destroy({
            where: { id_mantencion: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Mantencion no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar mantencion:", error);
        res.status(500).json({ message: "Error al eliminar mantencion", error: error.message });
    }
};

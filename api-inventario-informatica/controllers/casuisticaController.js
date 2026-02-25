const { Casuistica } = require('../models');

exports.getAllCasuisticas = async (req, res) => {
    try {
        const casuisticas = await Casuistica.findAll({
            order: [['id_casuistica', 'DESC']]
        });
        res.json(casuisticas);
    } catch (error) {
        console.error("Error al obtener casuisticas:", error);
        res.status(500).json({ message: "Error al obtener casuísticas", error: error.message });
    }
};

exports.createCasuistica = async (req, res) => {
    try {
        const newCasuistica = await Casuistica.create(req.body);
        res.status(201).json(newCasuistica);
    } catch (error) {
        console.error("Error al crear casuística:", error);
        res.status(500).json({ message: "Error al crear casuística", error: error.message });
    }
};

exports.updateCasuistica = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Casuistica.update(req.body, {
            where: { id_casuistica: id }
        });
        if (updated) {
            const updatedCasuistica = await Casuistica.findByPk(id);
            res.status(200).json(updatedCasuistica);
        } else {
            res.status(404).json({ message: "Casuística no encontrada" });
        }
    } catch (error) {
        console.error("Error al actualizar casuística:", error);
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

exports.deleteCasuistica = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Casuistica.destroy({
            where: { id_casuistica: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Casuística no encontrada" });
        }
    } catch (error) {
        console.error("Error al eliminar casuística:", error);
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};

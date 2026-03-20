const { CodigoADL } = require('../models');

const getAllCodigosADL = async (req, res) => {
    try {
        const codigos = await CodigoADL.findAll({
            order: [
                ['fecha_creacion', 'DESC'],
                ['id_codigoadl', 'DESC']
            ]
        });
        res.status(200).json(codigos);
    } catch (error) {
        console.error("Error al obtener códigos ADL:", error);
        res.status(500).json({ message: "Error al obtener los códigos ADL", error: error.message });
    }
};

const createCodigoADL = async (req, res) => {
    try {
        const maxId = await CodigoADL.max('id_codigoadl');
        const nextId = (maxId || 0) + 1;

        const codigo = await CodigoADL.create({
            ...req.body,
            id_codigoadl: nextId,
            fecha_creacion: new Date()
        });
        res.status(201).json(codigo);
    } catch (error) {
        console.error("Error al crear código ADL:", error);
        res.status(500).json({ message: "Error al crear el código ADL", error: error.message });
    }
};

const updateCodigoADL = async (req, res) => {
    try {
        const { id } = req.params;
        await CodigoADL.update(req.body, { where: { id_codigoadl: id } });
        res.status(200).json({ message: "Código ADL actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar código ADL:", error);
        res.status(500).json({ message: "Error al actualizar el código ADL", error: error.message });
    }
};

const deleteCodigoADL = async (req, res) => {
    try {
        const { id } = req.params;
        await CodigoADL.destroy({ where: { id_codigoadl: id } });
        res.status(200).json({ message: "Código ADL eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar código ADL:", error);
        res.status(500).json({ message: "Error al eliminar el código ADL", error: error.message });
    }
};

module.exports = {
    getAllCodigosADL,
    createCodigoADL,
    updateCodigoADL,
    deleteCodigoADL
};

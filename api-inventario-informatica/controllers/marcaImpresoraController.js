const { MarcaImpresora } = require('../models');
const { Op } = require('sequelize');

const getAllMarcasImpresoras = async (req, res) => {
    try {
        const marcas = await MarcaImpresora.findAll({
            order: [['nombre_marca', 'ASC']]
        });
        res.status(200).json(marcas);
    } catch (error) {
        console.error("Error al obtener marcas de impresoras:", error);
        res.status(500).json({ message: "Error al obtener las marcas de impresoras", error: error.message });
    }
};

const createMarcaImpresora = async (req, res) => {
    try {
        if (!req.body.nombre_marca) {
            return res.status(400).json({ message: "El nombre de la marca es requerido" });
        }

        // Check for duplicates
        const existingMarca = await MarcaImpresora.findOne({
            where: {
                nombre_marca: {
                    [Op.like]: req.body.nombre_marca
                }
            }
        });

        if (existingMarca) {
            return res.status(400).json({ message: "La marca de impresora ya existe (duplicada)." });
        }

        const maxId = await MarcaImpresora.max('id_marca');
        const nextId = (maxId || 0) + 1;

        const marca = await MarcaImpresora.create({
            ...req.body,
            id_marca: nextId
        });
        res.status(201).json(marca);
    } catch (error) {
        console.error("Error al crear marca de impresora:", error);
        res.status(500).json({ message: "Error al crear la marca de impresora", error: error.message });
    }
};

const updateMarcaImpresora = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.nombre_marca) {
            // Check for duplicates excluding the current one
            const existingMarca = await MarcaImpresora.findOne({
                where: {
                    nombre_marca: {
                        [Op.like]: req.body.nombre_marca
                    },
                    id_marca: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingMarca) {
                return res.status(400).json({ message: "El nombre de la marca de impresora ya está en uso." });
            }
        }

        await MarcaImpresora.update(req.body, { where: { id_marca: id } });
        res.status(200).json({ message: "Marca de impresora actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar marca de impresora:", error);
        res.status(500).json({ message: "Error al actualizar la marca de impresora", error: error.message });
    }
};

const deleteMarcaImpresora = async (req, res) => {
    try {
        const { id } = req.params;
        await MarcaImpresora.destroy({ where: { id_marca: id } });
        res.status(200).json({ message: "Marca de impresora eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar marca de impresora:", error);
        res.status(500).json({ message: "Error al eliminar la marca de impresora", error: error.message });
    }
};

module.exports = {
    getAllMarcasImpresoras,
    createMarcaImpresora,
    updateMarcaImpresora,
    deleteMarcaImpresora
};

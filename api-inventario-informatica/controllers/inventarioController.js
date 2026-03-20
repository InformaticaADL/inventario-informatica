const db = require("../models");
const { Inventario, Programa, Seccion } = db;
const { Op } = require("sequelize");

const getInventario = async (req, res) => {
    try {
        const data = await Inventario.findAll({
            include: [{
                model: Programa,
                as: 'programas',
                attributes: ['id_programa', 'nombre_programa'],
                through: { attributes: [] }
            }],
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

        // Automatic program association by unidad (seccion)
        if (req.body.unidad) {
            const seccion = await Seccion.findOne({ where: { nombre_seccion: req.body.unidad } });
            if (seccion) {
                const programas = await Programa.findAll({
                    include: [{
                        model: Seccion,
                        as: 'secciones',
                        where: { id_seccion: seccion.id_seccion },
                        through: { attributes: [] }
                    }]
                });
                const ids = programas.map(p => p.id_programa);
                if (ids.length > 0) {
                    await newItem.addProgramas(ids);
                }
            }
        }

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
        
        const oldUnidad = item.unidad;
        await item.update(req.body);

        // If unidad was changed, trigger new associations
        if (req.body.unidad && req.body.unidad !== oldUnidad) {
            const seccion = await Seccion.findOne({ where: { nombre_seccion: req.body.unidad } });
            if (seccion) {
                const programas = await Programa.findAll({
                    include: [{
                        model: Seccion,
                        as: 'secciones',
                        where: { id_seccion: seccion.id_seccion },
                        through: { attributes: [] }
                    }]
                });
                const ids = programas.map(p => p.id_programa);
                if (ids.length > 0) {
                    // Note: We add them, we don't necessarily remove old ones unless requested, 
                    // but usually, it's better to just add the new ones to the existing set.
                    // If the user wants a "sync", we'd use setProgramas, but that might delete manually added ones.
                    await item.addProgramas(ids);
                }
            }
        }

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

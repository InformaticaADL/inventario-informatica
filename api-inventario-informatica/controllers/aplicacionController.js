const db = require('../models');
const Aplicacion = db.Aplicacion;

// Get all
const getAplicaciones = async (req, res) => {
    try {
        const aplicaciones = await Aplicacion.findAll();
        res.json(aplicaciones);
    } catch (error) {
        console.error("Error obteniendo aplicaciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Get by ID
const getAplicacionById = async (req, res) => {
    try {
        const test = await Aplicacion.findByPk(req.params.id);
        if (test) {
            res.json(test);
        } else {
            res.status(404).json({ error: "Aplicación no encontrada" });
        }
    } catch (error) {
        console.error("Error obteniendo aplicación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Create
const createAplicacion = async (req, res) => {
    try {
        const newAplicacion = await Aplicacion.create(req.body);
        res.status(201).json(newAplicacion);
    } catch (error) {
        console.error("Error creando aplicación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Update
const updateAplicacion = async (req, res) => {
    try {
        const aplicacion = await Aplicacion.findByPk(req.params.id);
        if (aplicacion) {
            await aplicacion.update(req.body);
            res.json(aplicacion);
        } else {
            res.status(404).json({ error: "Aplicación no encontrada" });
        }
    } catch (error) {
        console.error("Error actualizando aplicación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Delete
const deleteAplicacion = async (req, res) => {
    try {
        const aplicacion = await Aplicacion.findByPk(req.params.id);
        if (aplicacion) {
            await aplicacion.destroy();
            res.json({ message: "Aplicación eliminada exitosamente" });
        } else {
            res.status(404).json({ error: "Aplicación no encontrada" });
        }
    } catch (error) {
        console.error("Error eliminando aplicación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    getAplicaciones,
    getAplicacionById,
    createAplicacion,
    updateAplicacion,
    deleteAplicacion
};

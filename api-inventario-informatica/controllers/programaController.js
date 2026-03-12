const { Programa } = require("../models");

const getAllProgramas = async (req, res) => {
    try {
        const programas = await Programa.findAll({
            order: [['nombre_programa', 'ASC']]
        });
        res.status(200).json(programas);
    } catch (error) {
        console.error("Error al obtener programas:", error);
        res.status(500).json({ message: "Error al obtener los programas", error: error.message });
    }
};

const createPrograma = async (req, res) => {
    try {
        // Encontrar el ID más alto actual
        const maxId = await Programa.max('id_programa');
        const nextId = (maxId || 0) + 1;

        const programa = await Programa.create({
            ...req.body,
            id_programa: nextId
        });
        res.status(201).json(programa);
    } catch (error) {
        console.error("Error al crear programa:", error);
        res.status(500).json({ message: "Error al crear el programa", error: error.message });
    }
};

const updatePrograma = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Programa.update(req.body, {
            where: { id_programa: id }
        });
        if (updated) {
            const updatedPrograma = await Programa.findOne({ where: { id_programa: id } });
            return res.status(200).json(updatedPrograma);
        }
        throw new Error('Programa no encontrado');
    } catch (error) {
        console.error("Error al actualizar programa:", error);
        res.status(500).json({ message: "Error al actualizar el programa", error: error.message });
    }
};

const deletePrograma = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Programa.destroy({
            where: { id_programa: id }
        });
        if (deleted) {
            return res.status(204).send("Programa eliminado");
        }
        throw new Error('Programa no encontrado');
    } catch (error) {
        console.error("Error al eliminar programa:", error);
        res.status(500).json({ message: "Error al eliminar el programa", error: error.message });
    }
};

module.exports = {
    getAllProgramas,
    createPrograma,
    updatePrograma,
    deletePrograma
};

const { Programa, Seccion, Inventario } = require("../models");

const getAllProgramas = async (req, res) => {
    try {
        const programas = await Programa.findAll({
            include: [{
                model: Seccion,
                as: 'secciones',
                attributes: ['id_seccion', 'nombre_seccion'],
                through: { attributes: [] }
            }],
            order: [['nombre_programa', 'ASC']]
        });
        res.status(200).json(programas);
    } catch (error) {
        console.error("Error al obtener programas:", error);
        res.status(500).json({ message: "Error al obtener los programas", error: error.message });
    }
};

const createPrograma = async (req, res) => {
    const { nombre_programa, id_seccion } = req.body; 
    try {
        const maxId = await Programa.max('id_programa');
        const nextId = (maxId || 0) + 1;

        const programa = await Programa.create({
            id_programa: nextId,
            nombre_programa
        });

        if (id_seccion) {
            const sections = Array.isArray(id_seccion) ? id_seccion : [id_seccion];
            await programa.setSecciones(sections);
        }

        const result = await Programa.findByPk(nextId, {
            include: [{ model: Seccion, as: 'secciones', through: { attributes: [] } }]
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Error al crear programa:", error);
        res.status(500).json({ message: "Error al crear el programa", error: error.message });
    }
};

const updatePrograma = async (req, res) => {
    const { id } = req.params;
    const { nombre_programa, id_seccion } = req.body;
    try {
        const programa = await Programa.findByPk(id);
        if (!programa) throw new Error('Programa no encontrado');

        if (nombre_programa) {
            await programa.update({ nombre_programa });
        }

        if (id_seccion !== undefined) {
            const sections = Array.isArray(id_seccion) ? id_seccion : [id_seccion];
            await programa.setSecciones(sections);
        }

        const updatedPrograma = await Programa.findByPk(id, {
            include: [{ model: Seccion, as: 'secciones', through: { attributes: [] } }]
        });
        
        return res.status(200).json(updatedPrograma);
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

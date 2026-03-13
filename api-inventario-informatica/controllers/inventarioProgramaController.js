const { Inventario, Programa, Seccion, InventarioProgramas } = require("../models");

const getProgramasByInventario = async (req, res) => {
    const { id_inventario } = req.params;
    try {
        const inventario = await Inventario.findByPk(id_inventario, {
            include: [{
                model: Programa,
                as: 'programas',
                include: [{
                    model: Seccion,
                    as: 'secciones',
                    attributes: ['id_seccion', 'nombre_seccion'],
                    through: { attributes: [] }
                }]
            }]
        });

        if (!inventario) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }

        res.status(200).json(inventario.programas);
    } catch (error) {
        console.error("Error al obtener programas del equipo:", error);
        res.status(500).json({ message: "Error al obtener los programas del equipo", error: error.message });
    }
};

const associateProgramas = async (req, res) => {
    const { id_inventario, id_programas } = req.body; 
    try {
        const inventario = await Inventario.findByPk(id_inventario);
        if (!inventario) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }

        await inventario.addProgramas(id_programas);
        res.status(200).json({ message: "Programas asociados con éxito" });
    } catch (error) {
        console.error("Error al asociar programas:", error);
        res.status(500).json({ message: "Error al asociar los programas", error: error.message });
    }
};

const associateProgramasBySeccion = async (req, res) => {
    const { id_inventario, id_seccion } = req.body;
    try {
        const inventario = await Inventario.findByPk(id_inventario);
        if (!inventario) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }

        // Find all programs associated with this section through M2M
        const programas = await Programa.findAll({
            include: [{
                model: Seccion,
                as: 'secciones',
                where: { id_seccion },
                through: { attributes: [] }
            }]
        });

        const ids = programas.map(p => p.id_programa);
        if (ids.length > 0) {
            await inventario.addProgramas(ids);
        }

        res.status(200).json({ message: `Se asociaron ${ids.length} programas de la sección.` });
    } catch (error) {
        console.error("Error al asociar programas por sección:", error);
        res.status(500).json({ message: "Error al asociar los programas por sección", error: error.message });
    }
};

const dissociatePrograma = async (req, res) => {
    const { id_inventario, id_programa } = req.params;
    try {
        const inventario = await Inventario.findByPk(id_inventario);
        if (!inventario) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }

        await inventario.removePrograma(id_programa);
        res.status(200).json({ message: "Programa desasociado con éxito" });
    } catch (error) {
        console.error("Error al desasociar programa:", error);
        res.status(500).json({ message: "Error al desasociar el programa", error: error.message });
    }
};

module.exports = {
    getProgramasByInventario,
    associateProgramas,
    dissociatePrograma,
    associateProgramasBySeccion
};

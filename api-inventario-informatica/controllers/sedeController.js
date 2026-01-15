const db = require("../models");
const { Op } = require("sequelize");
const { Sede } = db;

const getSedeList = async (req, res) => {
    try {
        const { search } = req.query;

        // Inicializamos la cláusula 'where' con la condición de screening
        let whereClause = {
            screening: 'S',
        };

        // Si hay un término de búsqueda, lo combinamos con la condición existente
        if (search) {
            whereClause = {
                [Op.and]: [ // Usamos Op.and para combinar las condiciones
                    whereClause, // La condición de screening
                    { // Las condiciones de búsqueda por nombre o sigla
                        [Op.or]: [
                            { nombre_lugaranalisis: { [Op.like]: `%${search}%` } },
                            { sigla: { [Op.like]: `%${search}%` } },
                        ],
                    },
                ],
            };
        }

        const sedes = await Sede.findAll({
            where: whereClause,
            order: [["nombre_lugaranalisis", "ASC"]],
        });

        res.status(200).json(sedes);
    } catch (error) {
        console.error("Error fetching sedes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { getSedeList };
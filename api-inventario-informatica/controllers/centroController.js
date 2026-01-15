const db = require("../models");
const { Centro } = db;
require("dotenv").config();

const getCentroList = async (req, res) => {
  const id_empresa = req.query.id_empresa;
  try {
    const centros = await Centro.findAll({
      where: { id_empresa: id_empresa, vigente: "S", realiza_screening: "S" },
      order: [
        ["nombre_centro", "ASC"], // Ordenar por nombre_centro en orden ascendente
      ],
    });
    res.status(200).json(centros);
  } catch (error) {
    console.error("Error al obtener las unidades:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al intentar obtener las centros" });
  }
};

module.exports = { getCentroList };

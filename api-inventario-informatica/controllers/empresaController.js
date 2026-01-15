const db = require("../models"); 
const { Empresa } = db; 

require("dotenv").config();

const getEmpresaList = async (req, res) => {
    try {
        const empresas = await Empresa.findAll({
            // 🛑 SOLUCIÓN: Usar 'attributes' para seleccionar SOLO las columnas que SÍ existen.
            attributes: [
                "id_empresa", "rut_empresa", "nombre_empresa", "direccion_empresa", 
                "email_empresa", "fono_empresa", "contacto_empresa", "email_contacto", 
                "fono_contacto", "convenio", "n_muestras_minimo", "id_empresaservicio", 
                "habilitado", "ld", "color", "nombre_fantasia", "rlegal_nombre", 
                "rlegal_rut", "rlegal_direccion", "realiza_screening"
            ], 
            where: { realiza_screening: "S" },
            order: [
                ["nombre_empresa", "ASC"],
            ],
        });
        res.status(200).json(empresas);
    } catch (error) {
        console.error("Error al obtener las empresas:", error);
        res
            .status(500)
            .json({ error: "Ocurrió un error al intentar obtener las empresas" });
    }
};

module.exports = { getEmpresaList };
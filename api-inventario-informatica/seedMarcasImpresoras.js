const sequelizeInstance = require('./db/SequelizeConfig');
const { MarcaImpresora } = require('./models');

const seedData = async () => {
    try {
        await sequelizeInstance.sync();
        const marcas = ['Epson', 'Ricoh', 'Brother', 'Canon'];
        for (const marca of marcas) {
            await MarcaImpresora.findOrCreate({
                where: { nombre_marca: marca },
                defaults: { nombre_marca: marca }
            });
        }
        console.log("Datos iniciales de marca_impresoras insertados correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error al insertar datos:", error);
        process.exit(1);
    }
};

seedData();

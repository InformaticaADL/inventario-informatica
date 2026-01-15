// Archivo: utils/utils.js
const net = require("net"); 

const generarZPLCompleto = (etiquetas) => {
    let zpl = ""; 
    const porFila = 2; 
    const filas = dividirEnFilas(etiquetas, porFila);

    // AJUSTE: Aumentamos +30 a cada posición para mover todo a la derecha
    // Antes: [10, 342] -> Ahora: [40, 372]
    const posicionesBaseX = [100, 432]; 

    filas.forEach((fila) => {
        zpl += "^XA";
        zpl += "^MD30"; 

        const posY = 60; 
        const altoZonaTexto = 190;

        fila.forEach((etiqueta, index) => {
            const baseX = posicionesBaseX[index] || 40; 
            const { nomenclatura, matriz, tipo, hasta, id_rotulado, preservante } = etiqueta;

            const alturaBarcode = 25;

            // --- RECALCULO DE ESPACIOS (EJE X) ---
            // Los offsets se mantienen igual, pero parten desde la nueva baseX más a la derecha
            
            // 1. Nomenclatura (Inicio: 0)
            const xNom = baseX;
            
            // 2. Matriz (Inicio: +45)
            const xMat = baseX + 45;

            // 3. Tipo (Inicio: +80)
            const xTipo = baseX + 80;

            // 4. Preservante (Inicio: +115) 
            const xPres = baseX + 115;

            // 5. Código de Barras (Inicio: +155)
            const xBar = baseX + 155;

            // 6. ID Texto (Inicio: +210)
            const xID = baseX + 210;

            // IMPORTANTE: Se eliminaron los comentarios "//" DENTRO del string para evitar errores de impresión
            // CAMBIO: Se redujo la fuente de nomenclatura de 35,35 a 25,25
            zpl += `
            ^FO${xNom},${posY}^FB${altoZonaTexto},1,0,C^A0B,25,25^FD${nomenclatura}-${hasta}^FS
            ^FO${xMat},${posY}^FB${altoZonaTexto},1,0,C^A0B,28,28^FD${matriz}^FS
            ^FO${xTipo},${posY}^FB${altoZonaTexto},1,0,C^A0B,28,28^FD(${tipo})^FS
            ^FO${xPres},${posY}^FB${altoZonaTexto},1,0,C^A0B,28,28^FD${preservante}^FS
            ^FO${xBar},${posY + 10}^BY2,2,${alturaBarcode}^BCB,${alturaBarcode},N,N,N^FD${id_rotulado},${hasta}^FS
            ^FO${xID},${posY}^FB${altoZonaTexto},1,0,C^A0B,24,24^FD${id_rotulado}^FS
            `;
        });
        zpl += "^XZ";
    });

    return zpl;
};

const imprimirTodo = async (etiquetas) => {
    const codigoZPLCompleto = generarZPLCompleto(etiquetas);
    await enviarAImpresora(codigoZPLCompleto);
};

const dividirEnFilas = (etiquetas, porFila = 2) => {
    const filas = [];
    for (let i = 0; i < etiquetas.length; i += porFila) {
        filas.push(etiquetas.slice(i, i + porFila));
    }
    return filas;
};

const enviarAImpresora = (codigoZPL) => {
    return new Promise((resolve, reject) => {
        const rawUrl = process.env.PRINTER_URL || "";
        let ip = rawUrl.replace("http://", "").replace("https://", "").split(":")[0];
        const port = 9100; 

        if (!ip) return reject(new Error("No IP config"));

        console.log(`Conectando a ${ip}:${port}...`);
        const client = new net.Socket();
        client.setTimeout(3000);

        client.connect(port, ip, () => {
            client.write(codigoZPL); 
            client.end(); 
        });

        client.on('close', () => resolve(true));
        client.on('timeout', () => { client.destroy(); reject(new Error("Timeout")); });
        client.on('error', (err) => reject(err));
    });
};

module.exports = { imprimirTodo };
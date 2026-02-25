const axios = require('axios');

async function checkSecciones() {
    try {
        const response = await axios.get('http://localhost:4000/api/seccion');
        const secciones = response.data;

        console.log(`Total secciones: ${secciones.length}`);

        const names = sections = secciones.map(s => s.nombre_seccion);
        const uniqueNames = new Set(names);

        if (names.length !== uniqueNames.size) {
            console.log("DUPLICATES FOUND!");
            const counts = {};
            names.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
            for (const [name, count] of Object.entries(counts)) {
                if (count > 1) {
                    console.log(`"${name}": ${count} times`);
                }
            }
        } else {
            console.log("No exact duplicates found.");
            // Check for case/trim duplicates
            const normalized = names.map(n => n.trim().toUpperCase());
            const uniqueNorm = new Set(normalized);
            if (names.length !== uniqueNorm.size) {
                console.log("Hidden duplicates (case/whitespace) found:");
                // simplistic check
                for (let i = 0; i < names.length; i++) {
                    for (let j = i + 1; j < names.length; j++) {
                        if (names[i].trim().toUpperCase() === names[j].trim().toUpperCase()) {
                            console.log(`"${names[i]}" vs "${names[j]}"`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkSecciones();

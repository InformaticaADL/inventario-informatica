
async function checkSecciones() {
    try {
        const response = await fetch('http://localhost:8001/api/seccion');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const secciones = await response.json();

        console.log(`Total secciones: ${secciones.length}`);

        const names = [];
        secciones.forEach(s => {
            if (s.nombre_seccion) names.push(s.nombre_seccion);
        });

        const uniqueNames = new Set(names);

        if (names.length !== uniqueNames.size) {
            console.log("DUPLICATES FOUND (Exact match):");
            const counts = {};
            names.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
            for (const [name, count] of Object.entries(counts)) {
                if (count > 1) {
                    console.log(`"${name}": ${count} times`);
                }
            }
        } else {
            console.log("No exact duplicates found.");
        }

        // Check for case/trim duplicates
        console.log("\nChecking for case/whitespace duplicates:");
        const normalizedMap = new Map();
        names.forEach(name => {
            const norm = name.trim().toUpperCase();
            if (normalizedMap.has(norm)) {
                console.log(`Duplicate found: "${name}" conflicts with "${normalizedMap.get(norm)}"`);
            } else {
                normalizedMap.set(norm, name);
            }
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkSecciones();

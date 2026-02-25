
async function checkInventarioUnidades() {
    try {
        const response = await fetch('http://localhost:8001/api/inventario');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        console.log(`Total items: ${data.length}`);

        const units = data.map(item => item.unidad).filter(Boolean);
        const uniqueUnits = new Set(units);

        console.log(`Unique raw units: ${uniqueUnits.size}`);

        // Count occurrences
        const counts = {};
        units.forEach(u => { counts[u] = (counts[u] || 0) + 1; });

        // Check for case/trim duplicates
        console.log("\nChecking for case/whitespace duplicates:");
        const normalizedMap = new Map();
        const duplicates = new Set();

        Object.keys(counts).forEach(unit => {
            const norm = unit.trim().toUpperCase();
            if (normalizedMap.has(norm)) {
                console.log(`Potential Duplicate: "${unit}" (${counts[unit]}) vs "${normalizedMap.get(norm)}" (${counts[normalizedMap.get(norm)]})`);
                duplicates.add(unit);
                duplicates.add(normalizedMap.get(norm));
            } else {
                normalizedMap.set(norm, unit);
            }
        });

        if (duplicates.size === 0) {
            console.log("No variations found (e.g. 'Finanzas' vs 'finanzas').");
        } else {
            console.log("\nThese variations are causing duplicates in the filter.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkInventarioUnidades();

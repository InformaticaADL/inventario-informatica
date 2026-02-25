
async function verifyFix() {
    try {
        const response = await fetch('http://localhost:8001/api/inventario');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        console.log(`Total items: ${data.length}`);

        // Simulate OLD logic
        const oldUnique = [...new Set(data.map(item => item.unidad).filter(Boolean))].sort();
        console.log(`Old Unique Count: ${oldUnique.length}`);

        // Simulate NEW logic
        const newUnique = [...new Set(data.map(item => item.unidad ? item.unidad.trim().toUpperCase() : "").filter(Boolean))].sort();
        console.log(`New Unique Count: ${newUnique.length}`);

        if (newUnique.length < oldUnique.length) {
            console.log("SUCCESS: Deduplication reduced the number of options.");
            console.log(`Reduced by ${oldUnique.length - newUnique.length} duplicates.`);
        } else {
            console.log("NOTE: No reduction found. Maybe the issue was not case/whitespace?");
            // Print them to see
            console.log("New List:", newUnique);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

verifyFix();

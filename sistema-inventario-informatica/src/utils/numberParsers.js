/**
 * Parses a numeric value that might be formatted with dots as thousand separators.
 * Example: "606.462" -> 606462
 * Example: "1.000" -> 1000
 * Example: 500 -> 500
 */
export const parseCLP = (value) => {
    if (value === null || value === undefined) return 0;

    // If it's already a number, return it
    if (typeof value === 'number') return value;

    // Is it a string?
    if (typeof value === 'string') {
        // Remove dots (thousand separators) and replace comma with dot (decimal) if any
        // But for CLP usually we just want integer integers mostly. 
        // Let's assume input "606.462" means 606462.
        // Step 1: Remove all dots
        const cleanString = value.replace(/\./g, '');
        // Step 2: Parse float (in case there are decimals like ,50)
        // If the format uses comma for decimals (e.g. 1.000,50), replace , with .
        const normalized = cleanString.replace(',', '.');

        return parseFloat(normalized) || 0;
    }

    return 0;
};

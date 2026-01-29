export const formatCLP = (value) => {
    if (!value && value !== 0) return "";

    // Clean string: remove existing non-numeric (except dot/comma if already formatted?)
    // Assuming value comes as string like "450908" or number 450908
    const num = Number(String(value).replace(/[^0-9.-]+/g, ""));

    if (isNaN(num)) return value; // Return original if not a number

    // Format using es-CL locale
    // User asked for "450.908", which is standard thousands separator in CL.
    return new Intl.NumberFormat('es-CL', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
};

import dayjs from "dayjs";
import { parseCLP } from "./numberParsers";

/**
 * Calculates the depreciated value of an item based on its acquisition date and net value.
 * Depreciation rules:
 * - Linear depreciation over 4 years (48 months).
 * - Minimum residual value is $50,000 CLP.
 *
 * @param {string|number} valorNeto - The original net value of the item.
 * @param {string|Date} fechaAdquisicion - The acquisition date.
 * @returns {number|null} The current depreciated value, or null if invalid inputs.
 */
export const calculateDepreciatedValue = (valorNeto, fechaAdquisicion) => {
    const MINIMUM_VALUE = 50000;
    const USEFUL_LIFE_MONTHS = 48; // 4 years

    if (!fechaAdquisicion) return MINIMUM_VALUE;

    const originalValue = valorNeto ? parseCLP(valorNeto) : 0;
    
    // If no valid value, fallback to minimum
    if (isNaN(originalValue) || originalValue <= 0) {
        return MINIMUM_VALUE;
    }

    const acquisitionDate = dayjs(fechaAdquisicion);
    if (!acquisitionDate.isValid()) return MINIMUM_VALUE;

    const currentDate = dayjs();
    const monthsElapsed = currentDate.diff(acquisitionDate, 'month');

    // If the item reached or exceeded its useful life
    if (monthsElapsed >= USEFUL_LIFE_MONTHS) {
        return Math.max(MINIMUM_VALUE, Math.min(originalValue, MINIMUM_VALUE)); 
        // Note: if originalValue < 50000, we just return originalValue
    }

    if (monthsElapsed < 0) {
        return originalValue; // Future date? Just return original
    }

    // Depreciable amount is the value above the minimum
    let depreciableAmount = originalValue - MINIMUM_VALUE;

    // If the original value is already 50k or less, it doesn't depreciate
    if (depreciableAmount <= 0) return originalValue;

    // Monthly depreciation
    const monthlyDepreciation = depreciableAmount / USEFUL_LIFE_MONTHS;

    const depreciatedValue = originalValue - (monthlyDepreciation * monthsElapsed);

    return Math.max(MINIMUM_VALUE, Math.round(depreciatedValue));
};

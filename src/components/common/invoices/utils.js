export const taxCategories = Object.freeze({
    // inclusive - subtract
    // exclusive - add

    "19% Incl. USt.": {
        taxPercentage: 19,
        status: "Incl.",
        taxAmount: (number) => {
            return ((number / 119) * 19).toFixed(2);
        },
        nettoSumme: (number) => {
            return ((number / 119) * 100).toFixed(2);
        },
        calculateFinal: (number) => {
            return number.toFixed(2);
        },
    },
    "7% Incl. USt.": {
        taxPercentage: 7,
        status: "Incl.",
        taxAmount: (number) => {
            return ((number / 107) * 7).toFixed(2);
        },
        nettoSumme: (number) => {
            return ((number / 107) * 100).toFixed(2);
        },
        calculateFinal: (number) => {
            return number.toFixed(2);
        },
    },
    "19% Excl. USt.": {
        taxPercentage: 19,
        status: "Excl.",
        taxAmount: (number) => {
            return ((number / 100) * 19).toFixed(2);
        },
        nettoSumme: (number) => number.toFixed(2),
        calculateFinal: (number) => {
            const multiple = number * 1.19;
            return multiple.toFixed(2);
        },
    },
    "7% Excl. USt.": {
        taxPercentage: 7,
        status: "Excl.",
        taxAmount: (number) => {
            return ((number / 100) * 7).toFixed(2);
        },
        nettoSumme: (number) => number.toFixed(2),
        calculateFinal: (number) => {
            const multiple = number * 1.07;
            return multiple.toFixed(2);
        },
    },
});

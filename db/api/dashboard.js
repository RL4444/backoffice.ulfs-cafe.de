const Invoices = require("../../models/invoices");

const getDashboardStats = async () => {
    try {
        const unpaidBills = Invoices.find({ paidStatus: false, billSent: true });
        const unsentBills = Invoices.find({ paidStatus: false, billSent: false });

        // const outstandingUnpaidAmountTotal = () => {};

        // const data = {
        //     outstandingUnpaidAmountTotal: unpaidBills
        // };

        return {
            data: null,
            success: true,
            error: false,
            message: "null",
        };
    } catch (err) {
        return {
            data: null,
            success: false,
            error: true,
            message: "Error: " + err,
        };
    }
};

module.exports = {
    getDashboardStats,
};

const Invoices = require("../../models/invoices");

const getAllInvoices = async ({
    order = 1,
    query = "",

    limit = 50,
    start = 0,
    isPaid = null,
    isSent = null,
}) => {
    const sortNumber = order === "desc" ? 1 : -1;
    const searchRegex = new RegExp(query, "i");

    const aggregateArray = [
        { $sort: { invoiceDate: sortNumber } },
        {
            $project: {
                invoiceNumber: "$invoiceNumber",
                invoiceDate: "$invoiceDate",
                customer: "$customer",
                eventDate: "$eventDate",
                eventType: "$eventType",
                peopleNumber: "$peopleNumber",
                serviceItems: "$serviceItems",
                vatCharged: "$vatCharged",
                paidStatus: "$paidStatus",
                billSent: "$billSent",
                lastUpdated: "$lastUpdated",
                archived: "$archived",
            },
        },

        {
            $match: {
                archived: false,
            },
        },
        { $limit: limit },
        { $skip: start },
    ];

    if (isPaid === true || isPaid === false) {
        aggregateArray.push({ $match: { paidStatus: isPaid } });
    }

    if (isSent === true || isSent === false) {
        aggregateArray.push({ $match: { billSent: isSent } });
    }

    if (query && query.length > 2) {
        aggregateArray.push({
            $match: {
                $or: [
                    { customer: { contactName: { $regex: searchRegex } } },
                    { customer: { companyName: { $regex: searchRegex } } },
                    { customer: { email: { $regex: searchRegex } } },
                ],
            },
        });
    }

    try {
        const result = await Invoices.aggregate(aggregateArray);
        return {
            data: result,
            success: true,
            error: false,
            message: "success",
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

const archiveInvoice = async (invoiceId) => {
    try {
        const result = await Invoices.findOneAndUpdate(
            {
                invoiceNumber: invoiceId,
            },
            {
                archived: true,
            },
            { upsert: true, useFindAndModify: false, returnDocument: true }
        );

        return {
            data: result,
            success: true,
            error: false,
            message: "success",
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

const getInvoice = async (invoiceNumber) => {
    try {
        const result = await Invoices.findOne({ invoiceNumber }).select(["-__v", "-_id"]);
        return {
            data: result,
            success: true,
            error: false,
            message: "success",
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

const createOrUpdateInvoice = async (invoiceItem) => {
    try {
        const result = await Invoices.findOneAndUpdate(
            {
                invoiceNumber: invoiceItem.invoiceNumber,
            },
            invoiceItem,
            { upsert: true, useFindAndModify: false, returnDocument: true }
        );

        return {
            data: result,
            success: true,
            error: false,
            message: "success",
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

const getNextBillNumber = async () => {
    try {
        const aggregateArray = [
            { $sort: { invoiceDate: -1 } },
            {
                $project: {
                    invoiceNumber: "$invoiceNumber",
                    invoiceDate: "$invoiceDate",
                    customer: "$customer",
                    eventDate: "$eventDate",
                    eventType: "$eventType",
                    peopleNumber: "$peopleNumber",
                    serviceItems: "$serviceItems",
                    vatCharged: "$vatCharged",
                    paidStatus: "$paidStatus",
                    billSent: "$billSent",
                    lastUpdated: "$lastUpdated",
                    archived: "$archived",
                },
            },
            { $limit: 1 },
        ];

        const result = await Invoices.aggregate(aggregateArray);
        const latestBill = result[0];
        const thisYear = `${new Date().getFullYear()}`.slice(-2);
        let newNumber = `1${thisYear}`;

        if (`${thisYear.slice(-2)}` === `${latestBill.invoiceNumber.slice(-2)}`) {
            newNumber = `${Number(latestBill.invoiceNumber.slice(0, -2)) + 1}${thisYear}`;
        } else {
        }
        console.log("in be ", { newNumber });

        return {
            data: { id: newNumber },
            success: true,
            error: false,
            message: "success",
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

const updateInvoiceEmailSentStatus = async (invoiceId) => {
    try {
        const result = await Invoices.findOneAndUpdate(
            {
                invoiceNumber: invoiceId,
            },
            {
                billSent: true,
            },
            { upsert: true, useFindAndModify: false, returnDocument: true }
        );

        return {
            data: result,
            success: true,
            error: false,
            message: "success",
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
    archiveInvoice,
    getAllInvoices,
    updateInvoiceEmailSentStatus,
    getInvoice,
    createOrUpdateInvoice,
    getNextBillNumber,
};

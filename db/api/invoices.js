const Invoices = require("../../models/invoices");

const getAllInvoices = async ({
    order = 1,
    query = "",

    limit = 50,
    start = 0,
    isPaid = null,
    isSent = null,
    billsOnly = true,
}) => {
    const sortNumber = order === "desc" ? 1 : -1;
    const searchRegex = new RegExp(query, "i");
    const invoiceKeyType = billsOnly ? "invoice" : "offer";

    const aggregateArray = [
        { $sort: { invoiceDate: sortNumber } },
        {
            $project: {
                invoiceNumber: "$invoiceNumber",
                invoiceDate: "$invoiceDate",
                invoiceType: "$invoiceType",
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
                invoiceType: invoiceKeyType,
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
    const invoiceType = invoiceItem.invoiceType ? "invoice" : "offer";

    try {
        const result = await Invoices.findOneAndUpdate(
            {
                invoiceNumber: invoiceItem.invoiceNumber,
            },
            {
                ...invoiceItem,
                invoiceType: invoiceType,
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

const getNextBillNumber = async (type = "invoice") => {
    try {
        const aggregateArray = [
            { $sort: { invoiceNumber: -1 } },
            {
                $project: {
                    invoiceNumber: "$invoiceNumber",
                    invoiceDate: "$invoiceDate",
                    invoiceType: "$invoiceType",
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
                    invoiceType: type,
                },
            },
            { $limit: 1 },
        ];
        const result = await Invoices.aggregate(aggregateArray);
        const latestBill = result[0];
        const thisYear = `${new Date().getFullYear()}`.slice(-2);

        if (type === "invoice") {
            // this is a type of invoice id being requested
            let newNumber = `1${thisYear}`;

            if (`${thisYear.slice(-2)}` === `${latestBill.invoiceNumber.slice(-2)}`) {
                newNumber = `${Number(latestBill.invoiceNumber.slice(0, -2)) + 1}${thisYear}`;
            }
            return {
                data: { id: newNumber },
                success: true,
                error: false,
                message: "success",
            };
        } else if (type === "offer") {
            // this is a type of offer id being requested
            let newNumber = `offer-1${thisYear}`;

            if (`${thisYear.slice(-2)}` === `${latestBill.invoiceNumber.slice(-2)}`) {
                newNumber = `offer-${Number(latestBill.invoiceNumber.split("-")[1].slice(0, -2)) + 1}${thisYear}`;
            }
            return {
                data: { id: newNumber },
                success: true,
                error: false,
                message: "success",
            };
        } else {
            throw new Error("type passed to create new number is missing or incorrectly spelled. Call Rory");
        }
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

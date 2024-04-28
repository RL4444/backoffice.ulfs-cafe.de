const Customers = require("../../models/customer");

const getAllCustomers = async () => {
    try {
        const result = await Customers.find().select(["-__v", "-_id"]);
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

const getCustomer = async (email) => {
    try {
        const result = await Customers.findOne({ email: email }).select(["-__v", "-_id"]);
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

const createOrUpdateCustomer = async (customer) => {
    try {
        const result = await Customers.findOneAndUpdate(
            {
                email: customer.email,
            },
            customer,
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
    getAllCustomers,
    getCustomer,
    createOrUpdateCustomer,
};

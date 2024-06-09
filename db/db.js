const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose"); //import fresh mongoose object
const { log } = require("mercedlogger"); // import merced logger

const mongoURI = process.env.REACT_APP_MONGODB_URI;

const { getAllCustomers, createOrUpdateCustomer, getCustomer } = require("./api/customers");
const {
    createOrUpdateInvoice,
    getAllInvoices,
    getInvoice,
    updateInvoiceEmailSentStatus,
    archiveInvoice,
    getNextBillNumber,
} = require("./api/invoices");
const { getDashboardStats } = require("./api/dashboard");

function connectToDB() {
    console.log("checking connection in connectToDB");
    mongoose.connect = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // CONNECTION EVENTS
    mongoose.connection
        .on("open", () => log.green("DATABASE STATE", "Connection Open"))
        .on("close", () => log.magenta("DATABASE STATE", "Connection Closed"))
        .on("error", (error) => log.red("DATABASE STATE", error));
}

connectToDB();

// function to add the values in the backend
module.exports = {
    connectToDB,
    getAllCustomers,
    getCustomer,
    createOrUpdateCustomer,
    createOrUpdateInvoice,
    archiveInvoice,
    getAllInvoices,
    updateInvoiceEmailSentStatus,
    getInvoice,
    getDashboardStats,
    getNextBillNumber,
    mongoose,
};

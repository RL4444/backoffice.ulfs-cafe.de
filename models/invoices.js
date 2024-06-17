const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Bills Schema
const InvoicesSchema = new Schema({
    invoiceNumber: { type: String, unique: true, required: true },
    invoiceDate: { type: Date, required: true, default: new Date().toUTCString },
    invoiceType: { type: String, enum: ["invoice", "offer"], required: true, default: "invoice" }, // invoice or offer
    customer: { type: Object, required: true }, // make this a type of Customer model entry liink
    eventKeyword: { type: String, required: true, default: "" },
    eventDate: { type: Date, required: true },
    eventType: { type: String, required: true, default: "catering" }, // can be delivery | function | something tbc
    additionalNotes: { type: String, default: "" },
    peopleNumber: { type: Number, required: true, default: 1 },
    serviceItems: [
        {
            article: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    vatCharged: { type: String, required: true },
    paidStatus: { type: Boolean, reqiured: true, default: false },
    billSent: { type: Boolean, required: true, default: false },
    archived: { type: Boolean, required: true, default: false },
    lastUpdated: { type: Date, required: true, default: new Date().toUTCString },
});

// Invoices Model
const Invoices = mongoose.model("Invoices", InvoicesSchema);

module.exports = Invoices;

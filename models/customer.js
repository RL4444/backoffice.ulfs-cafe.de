const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Customers Schema
const CustomersSchema = new Schema({
    companyName: { type: String, required: true, default: "Das GmbH" },
    contactName: { type: String, required: true, default: "John Doe" },
    email: { type: String, required: true, unique: true },
    taxId: { type: String, required: true, default: "1234556678" },
    address: [{ type: String, required: true, default: "address line" }],
});

// Customers Model
const Customers = mongoose.model("Customers", CustomersSchema);

module.exports = Customers;

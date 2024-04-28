const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Customers Schema
const SettingsSchema = new Schema({
    companyName: { type: String, required: true, default: "Das GmbH" },
    contactName: { type: String, required: true, default: "John Doe" },
    email: { type: String, required: true, unique: true },
    taxId: { type: String, required: true, default: "1234556678" },
    address: [{ type: String, required: true, default: "address line" }],
});

// Settings Model
const Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;

const express = require("express");
const router = express.Router();

const customerRoutes = require("./customer.js");
const invoiceRoutes = require("./invoice.js");
const userRoutes = require("./user.js");
const dashboardRoutes = require("./dashboard.js");

router.use("/customer", customerRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/user", userRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;

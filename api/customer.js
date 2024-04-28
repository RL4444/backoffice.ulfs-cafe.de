const express = require("express");
const db = require("../db/db");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.get("/", checkAuth, async (req, res, next) => {
    const { customerEmail } = req.query;
    const { data, error, message, success } = await db.getCustomer(customerEmail);
    res.send({
        success,
        data,
        error,
        message,
    });
});

router.post("/upsert", checkAuth, async (req, res, next) => {
    const { customer } = req.body;
    const { data, error, success, message } = await db.createOrUpdateCustomer(customer);
    res.send({
        data,
        error,
        success,
        message,
    });
});

router.get("/list", checkAuth, async (req, res, next) => {
    const { data, error, success, message } = await db.getAllCustomers();
    res.send({
        data,
        error,
        success,
        message,
    });
});

router.put("/delete/:invoiceNumber", checkAuth, async (req, res, next) => {
    const { invoiceNumber } = req.params;
    const { data, error, success, message } = await db.getInvoice(invoiceNumber);
    res.send({
        data,
        error,
        success,
        message,
    });
});

module.exports = router;

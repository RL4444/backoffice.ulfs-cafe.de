const express = require("express");
const router = express.Router();
const db = require("../db/db");
const checkAuth = require("../middleware/checkAuth");
const { sendMail } = require("../mailer/sendMail");

router.get("/list/all", checkAuth, async (req, res, next) => {
    const { order, query, limit, start, isPaid, isSent, billsOnly } = req.query;
    const { data, error, success, message } = await db.getAllInvoices({
        order,
        query,
        limit,
        start,
        isPaid: isPaid === "true" ? true : isPaid === "false" ? false : null,
        isSent: isSent === "true" ? true : isSent === "false" ? false : null,
        billsOnly: billsOnly === "true" ? true : billsOnly === "false" ? false : null,
    });
    res.send({
        data,
        error,
        success,
        message,
    });
});
router.get("/new/number", checkAuth, async (req, res, next) => {
    const { type } = req.query;
    const { data, error, success, message } = await db.getNextBillNumber(type);
    res.send({
        data,
        error,
        success,
        message,
    });
});
router.get("/:invoiceNumber", checkAuth, async (req, res, next) => {
    const { invoiceNumber } = req.params;
    const { data, error, message, success } = await db.getInvoice(invoiceNumber);
    res.send({
        success,
        data,
        error,
        message,
    });
});

router.post("/", checkAuth, async (req, res, next) => {
    const { invoice } = req.body;
    const { data, error, success, message } = await db.createOrUpdateInvoice(invoice);
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

router.post("/email-customer", checkAuth, async (req, res, next) => {
    const { email } = req.body;

    const { success, message } = await sendMail({
        customer: email.customer,
        event: email.event,
        pdfStream: email.blob,
        pdfBuffer: Buffer.from(email.buffer),
        fileName: email.fileName,
    });

    res.send({
        sent: message === "succes",
        error: message !== "success",
        success,
        message,
    });
});

module.exports = router;

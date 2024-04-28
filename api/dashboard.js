const express = require("express");
const router = express.Router();
const db = require("../db/db");
const checkAuth = require("../middleware/checkAuth");

router.get("/stats", checkAuth, async (req, res, next) => {
    const { data, error, success, message } = await db.getDashboardStats();
    res.send({
        data,
        error,
        success,
        message,
    });
});

module.exports = router;

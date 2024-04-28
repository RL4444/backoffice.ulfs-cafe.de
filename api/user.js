const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// const db = require("../db/db");

router.post("/logout", async (req, res, next) => {
    req.session = null;
    req.cookies = null;
});

router.post("/login", async (req, res, next) => {
    const { password } = req.body;
    const checkPassword = process.env.REACT_APP_APP_PASSWORD;
    const passwordsMatch = password === checkPassword;

    if (!password || !passwordsMatch) {
        res.send({
            error: true,
            message: "Ungultiges password",
        });
        return;
    }

    const token = jwt.sign(
        {
            isLoggedIn: true,
        },
        process.env.REACT_APP_COOKIE_SECRET,
        { expiresIn: "1 week" }
    );

    req.session = {
        token: token,
    };

    res.send({
        error: false,
        message: "password correct",
        token,
    });
});

module.exports = router;

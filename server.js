const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

dotenv.config();

const apiRoutes = require("./api/index.js");

const app = express();
const isDev = process.env.PORT ? false : true;
const port = process.env.PORT || 3001;

const buildPath = path.join(__dirname, "build");
const devPath = path.join(__dirname, "public");

app.use(
    cookieSession({
        name: "session",
        keys: process.env.REACT_APP_COOKIE_SECRET,
        // Cookie Options
        maxAge: 14 * 24 * 60 * 60 * 1000, // 2 week
    })
);

app.use(express.static(buildPath));
app.use(express.json());
app.use(bodyParser.json());
app.use(
    cors({
        origin: "*", // that will for all like  https / http
    })
);

app.use(
    express.json({
        type: ["application/json", "text/plain"],
        limit: "50mb",
    })
);

app.use("/api/v1", apiRoutes);

if (!isDev) {
    process.env.REACT_APP_API_BASE_URL = "";
} else {
    console.log("In dev mode @ ", process.env.REACT_APP_API_BASE_URL);
}

// gets the static files from the build folder
app.get("*", (req, res) => {
    if (!isDev) {
        res.sendFile(path.join(buildPath, "index.html"));
    } else {
        res.sendFile(path.join(devPath, "index.html"));
    }
});

// Showing that the server is up and running
app.listen(port, () => {
    console.log(`Server is online on port: ${port}`);
});

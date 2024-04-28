const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
    try {
        const token = await request.headers.token;
        const decodedToken = jwt.verify(token, process.env.REACT_APP_COOKIE_SECRET);

        request.isLoggedIn = true;
        if (decodedToken && decodedToken.isLoggedIn) {
            next();
        } else {
            request.isLoggedIn = false;
        }
    } catch (error) {
        console.log("catch block middleware in be");
        request.isLoggedIn = false;
        response.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};

const jwt = require("jsonwebtoken");

const generateToken = async (userId, res) => {
    try {
        const options = {
            expiresIn: "2d"
        }
        const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, options);
        res.cookie("token", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000, //MS
            httpOnly: true, //prevent XSS attacks cross-site scripting attacks
            sameSite: "strict", //CSRF attacks cross-site request forgery attacks
            secure: process.env.NODE_ENV !== "development"
        });
        return token;
    } catch(error) {
        return error;
    }
}

module.exports = generateToken;
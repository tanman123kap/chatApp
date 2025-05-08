const jwt = require("jsonwebtoken");
const userModal = require("../modals/user.modal");

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(401).json({success: false, message: "Unauthorize Access!"});
        } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if(!decoded) {
                res.status(401).json({success: false, message: "Unauthorize Access!"});
            } else {
                const user = await userModal.findById(decoded.userId).select("-password");
                if(!user) {
                    res.status(404).json({success: false, message: "User Not Found!"});
                } else {
                    req.user = user;
                    next();
                }
            }
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

module.exports = authUser;
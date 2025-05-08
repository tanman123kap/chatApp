const express = require("express");
const {signup, login, logout, updateProfile, checkAuth} = require("../controllers/auth.controller.js");
const authUser = require("../middleware/authUser.js");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

authRouter.put("/update-profile", authUser, updateProfile);
authRouter.get("/checkauth", authUser, checkAuth);

module.exports = authRouter;
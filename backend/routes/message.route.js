const express = require("express");
const {userForSidebar, getUserLog, sendMessage} = require("../controllers/message.controller.js");
const authUser = require("../middleware/authUser.js");
const messageRouter = express.Router();

messageRouter.get("/user-sidebar", authUser, userForSidebar);
messageRouter.get("/:id", authUser, getUserLog);
messageRouter.post("/send/:id", authUser, sendMessage);

module.exports = messageRouter;
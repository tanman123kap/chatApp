const express = require("express");
const {app, server} = require("./config/socketIo.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/auth.route.js");
const messageRouter = require("./routes/message.route.js");

app.use(express.json({limit: "10mb"}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
    res.send("app");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected...");
    server.listen(process.env.PORT, () => {
        console.log(`Server live at port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
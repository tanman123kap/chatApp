const {Server} = require("socket.io");
const http = require("http");
const express = require("express");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

//used to store online users
const userSocketMap = {}; //userId: socketId

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;
    //io.emit() is used to send events to all connected clients
    io.emit("onlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = {io, app, server, getReceiverSocketId};
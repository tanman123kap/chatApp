const { getReceiverSocketId, io } = require("../config/socketIo.js");
const messageModal = require("../modals/message.modal.js");
const userModal = require("../modals/user.modal.js");
const cloudinary = require("cloudinary");

const userForSidebar = async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const sideUsers = await userModal.find({_id: {$ne: loggedUser}}).select("-password");
        res.status(200).json({success: true, users: sideUsers});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

const getUserLog = async (req, res) => {
    try {
        const {id: activeUserId} = req.params;
        const senderId = req.user._id;
        const messages = await messageModal.find({
            $or: [
                {sender: senderId, receiver: activeUserId},
                {sender: activeUserId, receiver: senderId}
            ]
        });
        res.status(200).json({success: true, message: messages});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image) {
            //Upload base64 to cloudinary
            const messageImage = await cloudinary.uploader.upload(image);
            imageUrl = messageImage.secure_url;
        }
        const newMessage = new messageModal({
            sender: senderId,
            receiver: receiverId,
            text: text,
            image: imageUrl
        });
        await newMessage.save();
        //socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json({success: true, message: newMessage});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

module.exports = {userForSidebar, getUserLog, sendMessage};
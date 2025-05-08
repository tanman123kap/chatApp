const cloudinary = require("../config/cloudinary.js");
const generateToken = require("../config/utils.js");
const userModal = require("../modals/user.modal.js");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const {fullname, email, password} = req.body;
        const user = await userModal.findOne({email});
        if(user) {
            res.status(409).json({success: false, message: "User already exists!"});
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModal({
                fullname: fullname,
                email: email,
                password: hashedPassword
            });
            if(newUser) {
                generateToken(newUser._id, res);
                await newUser.save();
                res.status(201).json({success: true, newUser});
            } else {
                res.status(400).json({success: false, message: "Invalid User Data!"});
            }
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }   
}
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModal.findOne({email});
        if(!user) {
            res.status(400).json({success: false, message: "Invalid Credentials!"});
        } else {
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword) {
                res.status(400).json({success: false, message: "Invalid Credentials!"});
            } else {
                generateToken(user._id, res);
                res.status(200).json({success: true, user});
            }
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }   
}
const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0
        });
        res.status(200).json({success: true, message: "Logged Out Successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }   
}

const updateProfile = async (req, res) => {
    try {
        const {profilepic} = req.body;
        const userId = req.user._id;
        if(!profilepic) {
            res.status(400).json({success: false, message: "Profile Picture required!"});
        } else {
            const updateProfile = await cloudinary.uploader.upload(profilepic);
            const updateUser = await userModal.findByIdAndUpdate(userId, {profilepic: updateProfile.secure_url}, {new: true});
            res.status(200).json({success: true, updateUser});
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json({success: true, user: req.user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

module.exports = {signup, login, logout, updateProfile, checkAuth};
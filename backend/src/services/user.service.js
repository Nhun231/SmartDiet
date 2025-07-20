const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { StatusCodes } = require("http-status-codes");
const BaseError = require("../utils/BaseError.js");
const EmailService = require("../services/email.service.js");
const { getLatestCalculateByUserId } = require("./calculate.service.js");

//Create user
const createUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        //password hash
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        req.body.password = passwordHash;

        if (user == null) {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();

            //send welcome email
            EmailService.sendWelcomeOnboardEmail(req.body.username, req.body.email);
            return savedUser;
        } else {
            throw new Error("Email này đã có người sử dụng");
        }
    } catch (error) {
        throw new BaseError(
            StatusCodes.BAD_REQUEST,
            `Lỗi khi tạo người dùng mới: ${error.message}`
        );
    }
};

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi khi tìm người dùng: ${error.message}`
        );
    }
};

//Find user by eamil
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.query.email });
        if (user == null) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi khi tìm người dùng: ${error.message}`
        );
    }
};

//Update user by email
const updateUserByEmail = async (req, res) => {
    try {
        //find user by email
        const user = await User.findOne({ email: req.user.email });

        if (user == null) {
            throw new Error("Người dùng không tồn tại.");
        } else {
            //update user infor
            Object.assign(user, req.body);

            //password hash
            if (req.body.password != null) {
                user.password = await bcrypt.hash(req.body.password, 10);
                console.log("user Update", user);
            }

            const updatedUser = await user.save();

            return res
                .status(200)
                .json({
                    message: "Cập nhật thông tin người dùng thành công",
                    user: updatedUser,
                });
        }
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi cập nhật thông tin người dùng: ${error.message}`
        );
    }
};

//Delete user by email
const deleteUserByEmail = async (req, res) => {
    try {
        //find user by email
        const user = await User.findOne({ email: req.query.email });
        if (user == null) {
            throw new Error("Người dùng không tồn tại.");
        } else {
            //delete user
            await User.deleteOne({ email: user.email });
            return res.status(200).json({ message: "Xóa người dùng thành công." });
        }
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi khi xóa người dùng: ${error.message}`
        );
    }
};
//Find user by Id
const getUserByUserId = async (req, res) => {
    try {
        const user = await User.findById(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        return res.status(200).json(user);
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi khi tìm người dùng: ${error.message}`
        );
    }
};
/// Find user by email (email decode từ access token) 
const getUserByEmail1 = async (req, res) => {
    try {
        const email = req.user.email; // lấy từ verifyJWTs middleware
        const user = await User.findOne({ email: email }).select(
            'username email gender height weight dob age activity');
        if (user == null) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        throw new BaseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Lỗi khi tìm người dùng: ${error.message}`
        );
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
    getUserByUserId,
    getUserByEmail1,
};

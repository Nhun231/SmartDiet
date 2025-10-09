const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const userSerivce = require('../services/user.service.js');
const catchAsync = require('../utils/catchAsync.js')

//Create user
const createUser = catchAsync(async (req, res) => {
    const savedUser = await userSerivce.createUser(req, res);
    res.status(201).json(savedUser);
});

//Get all users
const getAllUsers = catchAsync(async (req, res) => {
    await userSerivce.getAllUsers(req, res);
});

//Find user by eamil
const getUserByEmail = catchAsync(async (req, res) => {
    await userSerivce.getUserByEmail(req, res);
});

//Update user by email
const updateUserByEmail = catchAsync(async (req, res) => {
    await userSerivce.updateUserByEmail(req, res);
});

//Delete user by email
const deleteUserByEmail = catchAsync(async (req, res) => {
    await userSerivce.deleteUserByEmail(req, res);
});
//Get user by userId
const getUserByUserId = catchAsync(async (req, res) => {
    await userSerivce.getUserByUserId(req, res);
});
//Find user by email(email decode tu accesstoken)
const getUserByEmail1 = catchAsync(async (req, res) => {
    await userSerivce.getUserByEmail1(req, res);
});

// Admin: Get all users with pagination
const getAllUsersAdmin = catchAsync(async (req, res) => {
    try {
        console.log('getAllUsersAdmin called with user:', req.user);
        const { page = 1, limit = 20, search = null } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        console.log('Query:', query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await User.countDocuments(query);
        console.log('Found users:', users.length, 'Total:', total);
        
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalUsers: total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
});

// Admin: Get user statistics
const getUserStats = catchAsync(async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const usersByLevel = await User.aggregate([
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const topUsers = await User.find()
            .select('username coins level')
            .sort({ coins: -1 })
            .limit(5);
            
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                usersByLevel,
                topUsers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê người dùng',
            error: error.message
        });
    }
});

// Admin: Update user level
const updateUserLevel = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { level } = req.body;
        
        if (![1, 2, 3].includes(level)) {
            return res.status(400).json({
                success: false,
                message: 'Cấp độ phải là 1, 2 hoặc 3'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            { level },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật cấp độ thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật cấp độ',
            error: error.message
        });
    }
});

// Admin: Update user coins
const updateUserCoins = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { coins } = req.body;
        
        if (coins < 0) {
            return res.status(400).json({
                success: false,
                message: 'Số xu không được âm'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            { coins },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật số xu thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật số xu',
            error: error.message
        });
    }
});

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
    getUserByUserId,
    getUserByEmail1,
    getAllUsersAdmin,
    getUserStats,
    updateUserLevel,
    updateUserCoins,
};


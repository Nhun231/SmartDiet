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

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail
};


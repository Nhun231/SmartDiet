const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const {StatusCodes} = require('http-status-codes');
const BaseError = require('../utils/baseError.js');

//Create user 
const createUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log('createUser is invoked');
        
        //password hash
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        req.body.password = passwordHash;

        if (user == null) {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            return savedUser;
        } else {
            throw new Error('User already exists with this email');
        }
    } catch (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, `Error creating user: ${error.message}`);
    }
}


//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

//Find user by eamil
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({email: req.query.email})
        if(user == null) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}

//Update user by email
const updateUserByEmail = async (req, res) => {
    try {
        //find user by email
        const user = await User.findOne({ email: req.body.email });

        if(user == null) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            //update user infor 
            Object.assign(user, req.body);

            const updatedUSer = await user.save();

            return res.status(200).json({message: 'User Updated Successfully', user: updatedUSer});
        }
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

//Delete user by email
const deleteUserByEmail = async (req, res) => {
    try {
        //find user by email
        const user = await User.findOne({email: req.query.email});
        if(user == null) {
            throw new Error('User not found');
        } else {
            //delete user
            await User.deleteOne({email: user.email});
            return res.status(200).json({message: 'User deleted successfully'});
        }
    
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail
};
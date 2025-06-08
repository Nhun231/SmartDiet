const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: User's name
 *         password:
 *           type: string
 *           description: Password of the user
 *         email:
 *           type: string
 *           description: User's email address
 *       example:
 *         username: NguyenBinh
 *         password: String@1
 *         email: nguyenbinh@gmail.com
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    refreshToken: { type: String } // Optional: default: null
});

const User = mongoose.model('User', userSchema);

module.exports = User;
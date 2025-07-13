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
 *         dob:
 *           type: string
 *           description: User's date of birth
 *         age:
 *           type: integer
 *           description: Tuổi
 *         gender:
 *           type: string
 *           enum: [Nam, Nữ]
 *           description: Giới tính
 *         height:
 *           type: number
 *           description: Chiều cao (cm)
 *         weight:
 *           type: number
 *           description: Cân nặng (kg)
 *         activity:
 *           type: string
 *           description: Mức độ vận động
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
        required: function () {
            return !this.googleId;
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    googleId: {
        type: String,
        default: null
    },
    refreshToken: { type: String },
    age: Number,
    gender: {
        type: String,
        enum: ['Nam', 'Nữ']
    },
    height: Number,
    weight: Number,
    activity: String,
    dob: {
        type: Date,
        require: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
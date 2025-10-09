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
 *         level:
 *           type: integer
 *           description: Cấp độ gói premium (1, 2, 3)
 *           example: 1
 *         coins:
 *           type: number
 *           description: Số xu của người dùng
 *           example: 100
 *         premiumExpiry:
 *           type: string
 *           format: date-time
 *           description: Ngày hết hạn gói premium
 *         aiChatUsed:
 *           type: number
 *           description: Số lượt chat AI đã sử dụng trong tháng
 *           example: 5
 *         expertChatUsed:
 *           type: number
 *           description: Số lượt chat chuyên gia đã sử dụng trong tháng
 *           example: 2
 *         lastResetDate:
 *           type: string
 *           format: date
 *           description: Ngày reset lượt chat cuối cùng
 *       example:
 *         username: NguyenBinh
 *         password: String@1
 *         email: nguyenbinh@gmail.com
 *         level: 1
 *         coins: 100
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
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    level: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    coins: {
        type: Number,
        default: 0,
        min: 0
    },
    premiumExpiry: {
        type: Date,
        default: null
    },
    aiChatUsed: {
        type: Number,
        default: 0,
        min: 0
    },
    expertChatUsed: {
        type: Number,
        default: 0,
        min: 0
    },
    lastResetDate: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
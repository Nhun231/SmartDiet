const { StatusCodes } = require('http-status-codes');
const BaseError = require('../utils/baseError.js');
const Calculate = require('../models/calculate.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');

const calculateTDEE = async (req) => {
    const { userId, gender, age, height, weight, activity } = req.body;

    if (!userId || !gender || !age || !height || !weight || !activity) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Thiếu thông tin để tính toán!');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'userId không hợp lệ!');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại trong hệ thống');
    }
    let bmr = 0;
    if (gender === 'Nam') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'Nữ') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Giới tính không hợp lệ!');
    }


    const activityFactors = {
        'ít': 1.2,
        'nhẹ': 1.375,
        'vừa': 1.55,
        'nhiều': 1.725,
        'cực_nhiều': 1.9
    };

    const factor = activityFactors[activity];
    if (!factor) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Mức độ vận động không hợp lý!');
    }

    const tdee = bmr * factor;
    const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(2);

    const result = new Calculate({
        userId,
        gender,
        age,
        height,
        weight,
        activity,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        bmi
    });
    await result.save();

    return {
        message: 'Successful!',
        bmr: result.bmr,
        tdee: result.tdee,
        bmi: result.bmi
    }
}

module.exports = { calculateTDEE };
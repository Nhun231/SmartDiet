const { StatusCodes } = require('http-status-codes');
const BaseError = require('../utils/baseError.js');
const Calculate = require('../models/calculate.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');

const calculateTDEE = async (req) => {
    const userId = req.user.id;
    const { gender, age, height, weight, activity } = req.body;
    return await calculateTDEEWithoutRequest(userId, gender, age, height, weight, activity);
}

// Get newest Calculate Record by email
const getLatestCalculateByEmail = async (req, res) => {
    try {
        const email = req.user.email; // Lấy email từ token đã decode bởi middleware verifyJWTs
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Không có email trong token!' });
        }
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy người dùng với email này!' });
        }
        // Lấy record Calculate mới nhất theo userId
        const latestCalc = await Calculate.findOne({ userId: user._id }).sort({ createdAt: -1 });

        if (!latestCalc) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không có dữ liệu tính toán nào cho người dùng này.' });
        }
        return res.status(StatusCodes.OK).json({
            bmr: latestCalc.bmr,
            tdee: latestCalc.tdee,
            bmi: latestCalc.bmi,
            waterIntake: latestCalc.waterNeeded,
            age: latestCalc.age,
            gender: latestCalc.gender,
            height: latestCalc.height,
            weight: latestCalc.weight,
            activity: latestCalc.activity,
            createdAt: latestCalc.createdAt,
        });

    } catch (error) {
        console.error('>> [ERROR] getLatestCalculateByEmail:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Lỗi server: ${error.message}` });
    }
};
const calculateTDEEWithoutRequest = async ( userId, gender, age, height, weight, activity ) => {
    if (!gender || !age || !height || !weight || !activity) {
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
    const waterNeeded = (weight * 0.03).toFixed(2);

    const result = new Calculate({
        userId,
        gender,
        age,
        height,
        weight,
        activity,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        bmi,
        waterNeeded
    });
    await result.save();

    return {
        message: 'Successful!',
        bmr: result.bmr,
        tdee: result.tdee,
        bmi: result.bmi,
        waterIntake: result.waterNeeded
    }
}

// Get all Calculate records for a user, sorted by time ascending
const getAllCalculationsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'userId không hợp lệ!');
        }
        const { filter } = req.query;
        let dateFilter = {};
        if (filter === 'week' || filter === 'month' || filter === 'year') {
            const now = new Date();
            let startDate = new Date(now);
            if (filter === 'week') {
                startDate.setDate(now.getDate() - 7);
            } else if (filter === 'month') {
                startDate.setDate(now.getDate() - 30);
            } else if (filter === 'year') {
                startDate.setDate(now.getDate() - 365);
            }
            dateFilter = { createdAt: { $gte: startDate, $lte: now } };
        }
        const calculations = await Calculate.find({ userId, ...dateFilter }).sort({ createdAt: 1 });
        if (!calculations || calculations.length === 0) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không có dữ liệu tính toán nào cho người dùng này.');
        }
        const report = calculations.map(calc => ({
            createdAt: calc.createdAt,
            weight: calc.weight,
            bmi: calc.bmi,
            tdee: calc.tdee,
            bmr: calc.bmr,
            waterIntake: calc.waterNeeded
        }));
        return res.status(StatusCodes.OK).json({ report });
    } catch (error) {
        if (error instanceof BaseError) throw error;
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Lỗi server: ${error.message}`);
    }
};

module.exports = { calculateTDEE, getLatestCalculateByEmail, calculateTDEEWithoutRequest, getAllCalculationsByUserId };
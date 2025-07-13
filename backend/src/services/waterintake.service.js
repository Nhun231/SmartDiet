const { StatusCodes } = require('http-status-codes');
const BaseError = require('../utils/baseError.js');
const Water = require('../models/waterintake.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');

const createWaterIntake = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const date = new Date(Date.now() + 7 * 60 * 60 * 1000 );

        if (!userId || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu thông tin để tạo lượng nước uống!'
            });
        }

        const newWater = new Water({ userId, date, amount });
        const savedWater = await newWater.save();

        return res.status(200).json(savedWater.toObject());
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tạo lượng nước uống!',
            error: error.message
        });
    }
};

const getWaterIntakeByUserIdAndDate = async (req, res) => {
    try {
        const { userId, date } = req.query;

        if (!userId || !date) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu thông tin để lấy lượng nước uống!'
            });
        }

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const waterIntake = await Water.findOne({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        return res.status(200).json(waterIntake ? waterIntake.toObject() : null);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy lượng nước uống!',
            error: error.message
        });
    }
};

const updateWaterIntake = async (req, res) => {
    try {
        const { userId, date, amount } = req.body;

        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        if (!userId || !date || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu thông tin để cập nhật lượng nước uống!'
            });
        }

        const updated = await Water.findOneAndUpdate(
            { 
                userId: userId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
             },
            { amount },
            { new: true }
        );

        if (!updated) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy lượng nước uống để cập nhật!'
            });
        }

        return res.status(200).json(updated);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật lượng nước uống!',
            error: error.message
        });
    }
};

module.exports = {
    createWaterIntake,
    getWaterIntakeByUserIdAndDate,
    updateWaterIntake
};

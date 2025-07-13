const waterIntakeService = require('../services/waterintake.service');
const catchAsync = require('../utils/catchAsync');

const createWaterIntake = catchAsync(async (req, res) => {
    const savedWater = await waterIntakeService.createWaterIntake(req, res);
    res.status(201).json(savedWater);
});

const getWaterIntakeByUserIdAndDate = catchAsync(async (req, res) => {
    const waterIntake = await waterIntakeService.getWaterIntakeByUserIdAndDate(req, res);
    res.status(200).json(waterIntake);
});

const updateWaterIntake = catchAsync(async (req, res) => {
    const updatedWater = await waterIntakeService.updateWaterIntake(req, res);
    res.status(200).json(updatedWater);
});

module.exports = {
    createWaterIntake,
    getWaterIntakeByUserIdAndDate,
    updateWaterIntake
};

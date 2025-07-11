const catchAsync = require('../utils/catchAsync');

exports.getWaterData = catchAsync(async (req, res) => {
    await waterService.getWaterData(req, res);
});

exports.addWater = catchAsync(async (req, res) => {
    await waterService.addWaterIntake(req, res);
});

exports.updateTarget = catchAsync(async (req, res) => {
    await waterService.updateTarget(req, res);
});

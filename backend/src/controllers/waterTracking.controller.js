const waterService = require('../services/waterTracking.service');
const catchAsync = require("../utils/catchAsync");

//1. Lấy thông tin uống nước: target, consume,...
exports.getWaterData = catchAsync(async (req, res) => {
    await waterService.getWaterData(req, res);
});
//2. Thêm lượng nước đã uống
exports.addWater = catchAsync(async (req, res) => {
    await waterService.addWaterIntake(req, res);
});
//3. Sửa target uống nước
exports.updateTarget = catchAsync(async (req, res) => {
    await waterService.updateTarget(req, res);
});
exports.getWaterReport = catchAsync(async (req, res) => {
    await waterService.getWaterSummary(req, res);
});
exports.getWaterDataByDate = catchAsync(async (req, res) => {
    await waterService.getWaterDataByDate(req, res);
});


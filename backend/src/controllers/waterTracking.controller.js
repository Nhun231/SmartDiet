const waterService = require('../services/waterTracking.service');

exports.getWaterData = async (req, res) => {
    await waterService.getWaterData(req, res);
};

exports.addWater = async (req, res) => {
    await waterService.addWaterIntake(req, res);
};

exports.updateTarget = async (req, res) => {
    await waterService.updateTarget(req, res);
};

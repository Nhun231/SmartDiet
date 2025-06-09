const calcuService = require('../services/calculate.service.js');
const catchAsync = require('../utils/catchAsync');

const calculateTDEE = catchAsync(async (req, res) => {
    const result = await calcuService.calculateTDEE(req);
    res.status(200).json(result);
});

module.exports = {
    calculateTDEE
};
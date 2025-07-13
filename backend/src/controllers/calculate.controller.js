const calcuService = require('../services/calculate.service.js');
const catchAsync = require('../utils/catchAsync');

const calculateTDEE = catchAsync(async (req, res) => {
    const result = await calcuService.calculateTDEE(req);
    res.status(200).json(result);
});
//Find lastest record of calculate by email(email decode tu accesstoken)
const getNewestCalculateByEmail = catchAsync(async (req, res) => {
    await calcuService.getLatestCalculateByEmail(req, res);
});

//Find lastest record of calculate by email(email decode tu accesstoken)
const getNewestCalculateByEmailByUserId = catchAsync(async (req, res) => {
    await calcuService.getLatestCalculateByEmail(req, res);
});
module.exports = {
    calculateTDEE,
    getNewestCalculateByEmail
};
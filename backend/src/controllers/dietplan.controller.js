const dietPlanService = require('../services/dietplan.service');
const catchAsync = require('../utils/catchAsync');
const BaseError = require("../utils/BaseError");
const {StatusCodes} = require("http-status-codes");

const generateDietPlan = catchAsync(async (req, res) => {
    const userId = req.body.userId || req.userId || req.user?.id; // support different auth flows
    const { goal, targetWeightChange } = req.body;
    const plan = await dietPlanService.generateDietPlan({ userId, goal, targetWeightChange });
    res.status(200).json(plan);
});

const updateDietPlan = catchAsync(async (req, res) => {
    const userId = req.body.userId || req.userId || req.user?.id;
    const { targetWeightChange, goal } = req.body;
    const plan = await dietPlanService.updateDietPlan({ userId, goal, targetWeightChange });
    res.status(200).json(plan);
});
const getCurrentDietPlan = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new BaseError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
    const plan = await dietPlanService.getCurrentDietPlan(userId);
    res.status(200).json(plan);
})

module.exports = { generateDietPlan, updateDietPlan, getCurrentDietPlan };
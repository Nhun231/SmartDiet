const dietPlanService = require('../services/dietplan.service');
const catchAsync = require('../utils/catchAsync');

const generateDietPlan = catchAsync(async (req, res) => {
    const userId = req.body.userId || req.userId || req.user?._id; // support different auth flows
    const { goal, targetWeightChange } = req.body;
    const plan = await dietPlanService.generateDietPlan({ userId, goal, targetWeightChange });
    res.status(200).json(plan);
});

const updateDietPlan = catchAsync(async (req, res) => {
    const userId = req.body.userId || req.userId || req.user?._id;
    const { targetWeightChange, goal } = req.body;
    const { id } = req.params;
    const plan = await dietPlanService.updateDietPlan({ planId: id, userId, goal, targetWeightChange });
    res.status(200).json(plan);
});

module.exports = { generateDietPlan, updateDietPlan }; 
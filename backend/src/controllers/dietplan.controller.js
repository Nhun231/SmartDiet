const catchAsync = require("../utils/catchAsync");
const dietPlanService = require("../services/dietplan.service");
const createDietPlan = catchAsync(async (req, res) => {
    await dietPlanService.createDietPlan(req, res);
});
module.exports = {createDietPlan}
const DietPlan = require('../models/dietplan.model');
const Calculate = require('../models/calculate.model');
const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../utils/baseError');

function calculateDietPlanDetails({ TDEE, goal, targetWeightChange }) {
    let dailyCalories = TDEE;
    let durationDays = 0;
    let endDate = null;
    if (goal === 'keep') {
        dailyCalories = TDEE;
    } else if (goal === 'lose' || goal === 'gain') {
        if (!targetWeightChange || isNaN(targetWeightChange) || targetWeightChange <= 0) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'Vui lòng điền số cân nặng muốn tăng/giảm');
        }
        // 0.5kg = 3500 kcal
        const totalKcal = Math.abs(targetWeightChange) * 7000; // 1kg = 7000 kcal
        const maxCalGap = 500;
        const kcalGap = Math.min(maxCalGap, Math.round(totalKcal / 30)); // try to spread over at least 30 days if possible

        if (goal === 'lose') {
            dailyCalories = TDEE - kcalGap;
        } else {
            dailyCalories = TDEE + kcalGap;
        }
        durationDays = Math.ceil(totalKcal / kcalGap); // if maxCalGap > totalKcal / 30 then duration is 30, else kcalGap=maxCalGap then the duration is > 30
        endDate = new Date();
        endDate.setDate(endDate.getDate() + durationDays);
    }
    return {
        dailyCalories: Math.round(dailyCalories),
        durationDays: goal === 'keep' ? 0 : durationDays,
        endDate: goal === 'keep' ? null : endDate
    };
}

const generateDietPlan = async ({ userId, goal, targetWeightChange }) => {
    if (!userId || !goal) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Cần điền đầy đủ thông tin');
    }
    // Get latest calculation for user
    const latestCalc = await Calculate.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestCalc) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Chưa tính toán các chỉ số cần thiết');
    }
    const TDEE = latestCalc.tdee;
    const { dailyCalories, durationDays, endDate } = calculateDietPlanDetails({ TDEE, goal, targetWeightChange });
    // Save plan
    const plan = new DietPlan({
        userId,
        goal,
        targetWeightChange: goal === 'keep' ? undefined : targetWeightChange,
        dailyCalories,
        durationDays,
        startDate: new Date(),
        endDate,
        referenceTDEE: TDEE
    });
    await plan.save();
    return plan;
};

const updateDietPlan = async ({ userId, goal, targetWeightChange }) => {
    const plan = await DietPlan.findOne({userId: userId});
    if (!plan) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy kế hoạch ăn kiêng');
    }
    // Get latest calculation for user
    const latestCalc = await Calculate.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestCalc) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Chưa tính toán các chỉ số cần thiết');
    }
    const TDEE = latestCalc.tdee;
    // Use new goal if provided, otherwise keep old
    const newGoal = goal || plan.goal;
    const { dailyCalories, durationDays, endDate } = calculateDietPlanDetails({ TDEE, goal: newGoal, targetWeightChange });
    plan.goal = newGoal;
    plan.targetWeightChange = newGoal === 'keep' ? undefined : targetWeightChange;
    plan.dailyCalories = dailyCalories;
    plan.durationDays = newGoal === 'keep' ? 0 : durationDays;
    plan.endDate = newGoal === 'keep' ? null : endDate;
    plan.referenceTDEE = TDEE;
    await plan.save();
    return plan;
};

module.exports = { generateDietPlan, updateDietPlan }; 
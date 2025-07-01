const mealService = require('../services/meal.service');
const catchAsync = require('../utils/catchAsync');

const createMeal = catchAsync(async (req, res) => {
    await mealService.createMeal(req, res);
});

const getAllMeals = catchAsync(async (req, res) => {
    await mealService.getAllMeals(req, res);
});

const getMealById = catchAsync(async (req, res) => {
    await mealService.getMealById(req, res);
});

const deleteMeal = catchAsync(async (req, res) => {
    await mealService.deleteMeal(req, res);
});
const updateMeal = catchAsync(async (req, res) => {
    await mealService.updateMeal(req, res);
});

const getMealByDate = catchAsync(async (req, res) => {
    await mealService.getMealByDate(req, res);
});

module.exports = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    getMealByDate
};

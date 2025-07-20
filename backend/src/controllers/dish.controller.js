const dishService = require('../services/dish.service.js');
const catchAsync = require('../utils/catchAsync.js');

// Create new dish
const createDish = catchAsync(async (req, res) => {
    const savedDish = await dishService.createDish(req, res);
    res.status(201).json(savedDish);
});

// Get all dishes (by user)
const getAllDishesByUser = catchAsync(async (req, res) => {
    await dishService.getAllDishesByUser(req, res);
});

// Get dish by ID
const getDishById = catchAsync(async (req, res) => {
    await dishService.getDishById(req, res);
});

// Update dish by ID
const updateDishById = catchAsync(async (req, res) => {
    await dishService.updateDishById(req, res);
});

// Delete dish by ID
const deleteDishById = catchAsync(async (req, res) => {
    await dishService.deleteDishById(req, res);
});

module.exports = {
    createDish,
    getAllDishesByUser,
    getDishById,
    updateDishById,
    deleteDishById,
};

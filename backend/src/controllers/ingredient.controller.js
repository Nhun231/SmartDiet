const ingredientService = require('../services/ingredient.service.js');
const catchAsync = require('../utils/catchAsync.js');
const Ingredient = require('../models/ingredient.model.js');


// Create new ingredient
const createIngredient = catchAsync(async (req, res) => {
    const savedIngredient = await ingredientService.createIngredient(req, res);
    res.status(201).json(savedIngredient);
});

// Get all ingredients
const getAllIngredients = catchAsync(async (req, res) => {
    await ingredientService.getAllIngredients(req, res);
});

// Get ingredient by ID
const getIngredientById = catchAsync(async (req, res) => {
    await ingredientService.getIngredientById(req, res);
});

// Update ingredient by ID
const updateIngredientById = catchAsync(async (req, res) => {
    await ingredientService.updateIngredientById(req, res);
});

// Delete ingredient by ID
const deleteIngredientById = catchAsync(async (req, res) => {
    await ingredientService.deleteIngredientById(req, res);
});

module.exports = {
    createIngredient,
    getAllIngredients,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById
};

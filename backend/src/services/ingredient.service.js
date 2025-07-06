const Ingredient = require('../models/ingredient.model');

// Create ingredient
const createIngredient = async (req, res) => {
    try {
        const ingredient = new Ingredient(req.body);
        const saved = await ingredient.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo món', error: error.message });
    }
};

// Get all ingredients
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy các món', error: error.message });
    }
};

// Get ingredient by ID
const getIngredientById = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Món không tồn tại' });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: `Lỗi khi lấy món `, error: error.message });
    }
};

// Update ingredient by ID
const updateIngredientById = async (req, res) => {
    try {
        const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            return res.status(404).json({ message: 'Món không tồn tại' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin món', error: error.message });
    }
};

// Delete ingredient by ID
const deleteIngredientById = async (req, res) => {
    try {
        const deleted = await Ingredient.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Món không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa món thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa món', error: error.message });
    }
};

module.exports = {
    createIngredient,
    getAllIngredients,
    getIngredientById,
    updateIngredientById,
    deleteIngredientById
};

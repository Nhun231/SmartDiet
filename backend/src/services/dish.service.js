const Dish = require("../models/dish.model");
const Meal = require('../models/meal.model');

const { calculateNutrition } = require("../utils/calculateNutrition");

// ─────────────────────────────────────────────────────
// Create dish
// ─────────────────────────────────────────────────────
const createDish = async (req, res) => {
    try {
        const { name, description, ingredients, userId } = req.body;

        // Tính dinh dưỡng
        const nutrition = await calculateNutrition(ingredients); // { calories, protein, fat, carbs, fiber }

        // Tạo dish mới
        const dish = new Dish({
            name,
            description,
            ingredients,
            userId,
            totals: nutrition,
            type: "dish", // ← tính server-side
        });

        const saved = await dish.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo món ăn', error: error.message });
    }
};

// ─────────────────────────────────────────────────────
// Get all dishes (by user)
// ─────────────────────────────────────────────────────
const getAllDishesByUser = async (req, res) => {
    try {
        const userId = req.userId || req.query.userId || req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const dishes = await Dish.find({ userId }).populate(
            "ingredients.ingredientId"
        );

        const withNutrition = dishes.map((d) => ({
            ...d.toObject(),
            nutrition: calculateNutrition(d.ingredients),
        }));

        res.status(200).json(withNutrition);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách món ăn",
            error: error.message,
        });
    }
};

// ─────────────────────────────────────────────────────
// Get dish by ID
// ─────────────────────────────────────────────────────
const getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id).populate(
            "ingredients.ingredientId"
        );
        if (!dish) {
            return res.status(404).json({ message: "Món ăn không tồn tại" });
        }

        const nutrition = calculateNutrition(dish.ingredients);
        res.status(200).json({ ...dish.toObject(), nutrition });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi lấy món ăn", error: error.message });
    }
};

// ─────────────────────────────────────────────────────
// Update dish by ID
// ─────────────────────────────────────────────────────
const updateDishById = async (req, res) => {
    try {
        const { name, description, ingredients } = req.body;

        const nutrition = await calculateNutrition(ingredients);

        const updated = await Dish.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                ingredients,
                totals: nutrition, // Cập nhật lại totals
            },
            { new: true, runValidators: true }
        ).populate("ingredients.ingredientId");

        if (!updated) {
            return res.status(404).json({ message: 'Món ăn không tồn tại' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật món ăn', error: error.message });
    }
};


// ─────────────────────────────────────────────────────
// Delete dish by ID
// ─────────────────────────────────────────────────────
const deleteDishById = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Dish.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Món ăn không tồn tại' });
        }

        await Meal.updateMany(
            { 'dish.dishId': id },
            { $pull: { dish: { dishId: id } } }
        );

        res.status(200).json({ message: 'Xóa món ăn và tham chiếu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa món ăn', error: error.message });
    }
};

module.exports = {
    createDish,
    getAllDishesByUser,
    getDishById,
    updateDishById,
    deleteDishById,
};

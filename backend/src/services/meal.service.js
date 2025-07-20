const Meal = require('../models/meal.model');
const { calculateNutrition } = require("../utils/calculateNutrition");
const { calculateNutritionForMeal } = require("../utils/calculateNutrition");

// Tạo bữa ăn mới
const createMeal = async (req, res) => {
    try {
        const { mealType, date, ingredients = [], dish = [], userId } = req.body;
        if (!userId) return res.status(400).json({ message: "Thiếu userId" });

        // Check if at least one ingredient or dish is provided
        if ((!ingredients || ingredients.length === 0) && (!dish || dish.length === 0)) {
            return res.status(400).json({ message: "Phải có ít nhất một nguyên liệu hoặc món ăn" });
        }

        const totals = await calculateNutritionForMeal(ingredients, dish);

        const meal = new Meal({ mealType, date, ingredients, dish, totals, userId });
        const saved = await meal.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('Error creating meal:', err);
        res.status(500).json({ message: "Lỗi tạo bữa ăn", error: err.message });
    }
};

// Lấy tất cả bữa ăn theo user
const getAllMeals = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId trong query" });
        }

        const meals = await Meal.find({ userId }).populate('ingredients.ingredientId').populate('dish.dishId');
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách bữa ăn', error: error.message });
    }
};

const getUserMealByUserIdAndDate = async (req, res) => {

    try {
        const { userId, date } = req.query;

        if (!userId || !date) {
            return res.status(400).json({ message: "Thiếu userId hoặc date trong body" });
        }

        const startOfDay = new Date(date + 'T00:00:00.000Z');
        const endOfDay = new Date(date + 'T23:59:59.999Z');

        const meals = await Meal.find({
            userId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).populate('ingredients.ingredientId').populate('dish.dishId');


        res.status(200).json(meals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: 'Lỗi lấy danh sách bữa ăn', error: error.message });
    }
};


// Lấy bữa ăn theo ID
const getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id).populate('ingredients.ingredientId').populate('dish.dishId');
        if (!meal) {
            return res.status(404).json({ message: 'Không tìm thấy bữa ăn' });
        }
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn bữa ăn', error: error.message });
    }
};

// Cập nhật bữa ăn theo ID
const updateMeal = async (req, res) => {
    try {
        const { mealType, date, ingredients = [], dish = [] } = req.body;
        const totals = await calculateNutritionForMeal(ingredients, dish);

        const updated = await Meal.findByIdAndUpdate(
            req.params.id,
            { mealType, date, ingredients, dish, totals },
            { new: true, runValidators: true }
        )
            .populate("ingredients.ingredientId")
            .populate("dish.dishId");

        if (!updated) return res.status(404).json({ message: "Bữa ăn không tồn tại" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Lỗi cập nhật bữa ăn", error: err.message });
    }
};

// Xoá bữa ăn theo ID
const deleteMeal = async (req, res) => {
    try {
        const deleted = await Meal.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy bữa ăn để xoá' });
        }
        res.status(200).json({ message: 'Đã xoá bữa ăn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xoá bữa ăn', error: error.message });
    }
};

// Lấy bữa ăn theo ngày, loại bữa và user
const getMealByDate = async (req, res) => {
    try {
        const { date, mealType, userId } = req.query;

        if (!date || !mealType || !userId) {
            return res.status(400).json({ message: "Thiếu thông tin date, mealType hoặc userId" });
        }

        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1);

        const meal = await Meal.findOne({
            mealType,
            userId,
            date: { $gte: parsedDate, $lt: nextDay },
        }).populate('ingredients.ingredientId').populate('dish.dishId');

        if (!meal) {
            return res.status(404).json({ message: "Không tìm thấy bữa ăn theo ngày và loại bữa đã chọn" });
        }

        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi tìm bữa ăn', error: error.message });
    }
};

module.exports = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    getMealByDate,
    getUserMealByUserIdAndDate
};

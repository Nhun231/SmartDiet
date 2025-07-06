const Meal = require('../models/meal.model');
const calculateNutrition = require("../utils/calculateNutrition");

// Tạo bữa ăn mới
const createMeal = async (req, res) => {
    try {
        const { mealType, date, ingredients } = req.body;
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const totals = await calculateNutrition(ingredients);

        const meal = new Meal({
            mealType,
            date,
            ingredients,
            totals,
            userId,
        });

        const saved = await meal.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tạo bữa ăn", error: error.message });
    }
};

// Lấy tất cả bữa ăn theo user
const getAllMeals = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId trong query" });
        }

        const meals = await Meal.find({ userId }).populate('ingredients.ingredientId');
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách bữa ăn', error: error.message });
    }
};

// Lấy bữa ăn theo ID
const getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id).populate('ingredients.ingredientId');
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
        const { mealType, date, ingredients } = req.body;

        const totals = await calculateNutrition(ingredients);

        const updated = await Meal.findByIdAndUpdate(
            req.params.id,
            {
                mealType,
                date,
                ingredients,
                totals,
            },
            { new: true, runValidators: true }
        ).populate("ingredients.ingredientId");

        if (!updated) {
            return res.status(404).json({ message: "Bữa ăn không tồn tại" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật bữa ăn", error: error.message });
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
        }).populate('ingredients.ingredientId');

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
};

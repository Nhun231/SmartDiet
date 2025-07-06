const Meal = require('../models/meal.model');

// Tạo bữa ăn mới
const createMeal = async (req, res) => {
    try {
        const meal = new Meal(req.body);
        const savedMeal = await meal.save();
        res.status(201).json(savedMeal);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo bữa ăn', error: error.message });
    }
};

// Lấy tất cả bữa ăn
const getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find().populate('ingredients.ingredientId');
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách bữa ăn', error: error.message });
    }
};

// Lấy một bữa ăn theo ID
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
        const updated = await Meal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('ingredients.ingredientId');

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy bữa ăn để cập nhật' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật bữa ăn', error: error.message });
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
// Lấy bữa ăn theo ngày và loại bữa
const getMealByDate = async (req, res) => {
    try {
        const { date, mealType } = req.query;

        if (!date || !mealType) {
            return res.status(400).json({ message: "Không tìm thấy ngày hoặc loại bữa ăn" });
        }

        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0); // so sánh theo ngày

        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1);

        const meal = await Meal.findOne({
            mealType,
            date: { $gte: parsedDate, $lt: nextDay }
        }).populate('ingredients.ingredientId');

        if (!meal) {
            return res.status(404).json({ message: "Không tìm thấy bữa ăn dựa trên ngày-bữa ăn bạn tìm" });
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
    getMealByDate
};

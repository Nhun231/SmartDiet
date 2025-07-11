const User = require("../models/user.model");
const {StatusCodes} = require("http-status-codes");
const DietPlan = require("../models/dietplan.model");

const createDietPlan = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) return res.status(StatusCodes.NOT_FOUND).send('Không tìm thấy người dùng');

        const newPlan = new DietPlan({
            userId: user._id,
            targetWeight: user.weight, // default to current weight
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            dailyCalories: req.body.dailyCalories,
            meals: req.body.meals,
            notes: req.body.notes
        });

        await newPlan.save();
        res.status(201).json(newPlan);
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
}
module.exports = {
    createDietPlan
};
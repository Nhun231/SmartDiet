const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dietPlanSchema = new Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetWeight: {
        type: Number
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    dailyCalories: {
        type: Number
    },
}, {timestamps: true});
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
module.exports = DietPlan;

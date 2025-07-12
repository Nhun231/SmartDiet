const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dietPlanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, enum: ['lose', 'keep', 'gain'], default: 'keep', required: true },
    targetWeightChange: { type: Number }, // in kg, optional for 'keep'
    dailyCalories: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    referenceTDEE: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calcuSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gender: { type: String, enum: ['Nam', 'Nữ'], required: true },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    activity: { type: String, required: true },
    bmr: { type: Number, required: true },
    tdee: { type: Number, required: true },
    bmi: { type: Number, required: true },
    waterNeeded: String,
    protein: { type: Number },
    fat: { type: Number },
    carbs: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Calculate', calcuSchema);
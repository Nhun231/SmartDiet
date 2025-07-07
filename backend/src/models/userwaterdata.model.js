const mongoose = require('mongoose');

const waterHistorySchema = new mongoose.Schema({
    time: { type: String, required: true },
    amount: { type: Number, required: true }
});

const userWaterDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    target: { type: Number, required: true, default: 2500 },
    consumed: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'ml' },
    history: [waterHistorySchema],
}, { timestamps: true });

module.exports = mongoose.model('UserWaterData', userWaterDataSchema);

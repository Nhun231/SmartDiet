const mongoose = require('mongoose');
const scheduleItemSchema = new mongoose.Schema({
    time: { type: String, required: true },        // ví dụ: "06:00"
    amount: { type: String, required: true },      // ví dụ: "250ml"
});
const reminderSettingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    wakeUpTime: { type: String, required: true },
    sleepTime: { type: String, required: true },
    reminderGap: { type: Number, required: true }, // minutes
    expoPushToken: { type: String },
    schedule: [scheduleItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('WaterReminderSetting', reminderSettingSchema);
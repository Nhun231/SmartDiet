/**
 * @swagger
 * components:
 *   schemas:
 *     ScheduleItem:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           example: "06:00"
 *         amount:
 *           type: string
 *           example: "250ml"
 *     WaterReminderSetting:
 *       type: object
 *       required:
 *         - userId
 *         - wakeUpTime
 *         - sleepTime
 *         - reminderGap
 *         - schedule
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *           example: 665f3ccbe6f7f1a9ef300001
 *         wakeUpTime:
 *           type: string
 *           example: "06:00"
 *         sleepTime:
 *           type: string
 *           example: "23:00"
 *         reminderGap:
 *           type: number
 *           description: Minutes between reminders
 *           example: 90
 *         expoPushToken:
 *           type: string
 *           example: "ExponentPushToken[xxxxxxxxxxx]"
 *         schedule:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ScheduleItem'
 */
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
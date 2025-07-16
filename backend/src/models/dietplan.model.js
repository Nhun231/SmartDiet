/**
 * @swagger
 * components:
 *   schemas:
 *     DietPlan:
 *       type: object
 *       required:
 *         - userId
 *         - goal
 *         - dailyCalories
 *         - durationDays
 *         - startDate
 *         - referenceTDEE
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *           example: 665f3ccbe6f7f1a9ef300001
 *         goal:
 *           type: string
 *           enum: [lose, keep, gain]
 *           description: Mục tiêu (giảm, giữ, tăng cân)
 *           example: lose
 *         targetWeightChange:
 *           type: number
 *           description: Số kg muốn tăng/giảm (bắt buộc nếu goal là lose/gain)
 *           example: 3
 *         dailyCalories:
 *           type: number
 *           description: Lượng calo mỗi ngày
 *           example: 1800
 *         durationDays:
 *           type: number
 *           description: Số ngày dự kiến
 *           example: 30
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Ngày bắt đầu
 *           example: 2025-07-16T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Ngày kết thúc
 *           example: 2025-08-16T00:00:00.000Z
 *         referenceTDEE:
 *           type: number
 *           description: TDEE tham chiếu
 *           example: 2100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
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
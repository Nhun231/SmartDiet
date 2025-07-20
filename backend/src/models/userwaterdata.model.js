/**
 * @swagger
 * components:
 *   schemas:
 *     WaterHistory:
 *       type: object
 *       properties:
 *         time:
 *           type: string
 *           example: "08:30"
 *         amount:
 *           type: number
 *           example: 250
 *     UserWaterData:
 *       type: object
 *       required:
 *         - userId
 *         - email
 *         - date
 *         - target
 *         - consumed
 *         - unit
 *         - history
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *           example: 665f3ccbe6f7f1a9ef300001
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         date:
 *           type: string
 *           example: "2025-07-16"
 *         target:
 *           type: number
 *           example: 2500
 *         consumed:
 *           type: number
 *           example: 1200
 *         unit:
 *           type: string
 *           example: "ml"
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WaterHistory'
 */
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

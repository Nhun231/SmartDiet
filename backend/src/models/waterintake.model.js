/**
 * @swagger
 * components:
 *   schemas:
 *     WaterIntake:
 *       type: object
 *       required:
 *         - userId
 *         - date
 *         - amount
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *           example: 665f3ccbe6f7f1a9ef300001
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of water intake
 *           example: 2025-07-16T00:00:00.000Z
 *         amount:
 *           type: number
 *           description: Amount of water (ml)
 *           example: 500
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waterSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Water", waterSchema);

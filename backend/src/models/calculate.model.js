const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Calculate:
 *       type: object
 *       required:
 *         - userId
 *         - gender
 *         - age
 *         - height
 *         - weight
 *         - activity
 *         - bmr
 *         - tdee
 *         - bmi
 *       properties:
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: ID tham chiếu đến người dùng
 *         gender:
 *           type: string
 *           enum: [Nam, Nữ]
 *           description: Giới tính
 *         age:
 *           type: integer
 *           description: Tuổi
 *         height:
 *           type: number
 *           format: float
 *           description: Chiều cao (cm)
 *         weight:
 *           type: number
 *           format: float
 *           description: Cân nặng (kg)
 *         activity:
 *           type: string
 *           description: Mức độ vận động (ít, vừa, cao,...)
 *         bmr:
 *           type: number
 *           format: float
 *           description: Basal Metabolic Rate – Tỷ lệ trao đổi chất cơ bản
 *         tdee:
 *           type: number
 *           format: float
 *           description: Total Daily Energy Expenditure – Tổng năng lượng tiêu thụ hàng ngày
 *         bmi:
 *           type: number
 *           format: float
 *           description: Body Mass Index – Chỉ số khối cơ thể
 *         waterNeeded:
 *           type: string
 *           description: Lượng nước cần thiết mỗi ngày (lit)
 *         protein:
 *           type: number
 *           format: float
 *           description: Lượng protein (gram)
 *         fat:
 *           type: number
 *           format: float
 *           description: Lượng chất béo (gram)
 *         carbs:
 *           type: number
 *           format: float
 *           description: Lượng tinh bột (gram)
 *         fiber:
 *           type: number
 *           format: float
 *           description: Lượng chất xơ (gram)
 *         proteinPercent:
 *           type: number
 *           format: float
 *           description: Tỷ lệ phần trăm protein trong tổng TDEE
 *         fatPercent:
 *           type: number
 *           format: float
 *           description: Tỷ lệ phần trăm chất béo trong tổng TDEE
 *         carbPercent:
 *           type: number
 *           format: float
 *           description: Tỷ lệ phần trăm carbs trong tổng TDEE
 *         fiberPercent:
 *           type: number
 *           format: float
 *           description: Tỷ lệ phần trăm chất xơ trong tổng TDEE
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Ngày tạo bản ghi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Ngày cập nhật bản ghi
 *       example:
 *         userId: "64a9dfc5f7340e3450fef123"
 *         gender: "Nam"
 *         age: 25
 *         height: 175
 *         weight: 70
 *         activity: "Hoạt động nhẹ"
 *         bmr: 1650
 *         tdee: 2200
 *         bmi: 22.86
 *         waterNeeded: "2.5"
 *         protein: 110
 *         fat: 60
 *         carbs: 275
 *         fiber: 30
 *         proteinPercent: 20
 *         fatPercent: 25
 *         carbPercent: 50
 *         fiberPercent: 5
 *         createdAt: "2025-07-16T10:20:00Z"
 *         updatedAt: "2025-07-16T10:25:00Z"
 */

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
    fiber: { type: Number, default: 0 },
    proteinPercent: { type: Number, default: 0 },
    fatPercent: { type: Number, default: 0 },
    carbPercent: { type: Number, default: 0 },
    fiberPercent: { type: Number, default: 0 },

}, { timestamps: true });

calcuSchema.post('save', async function (doc) {
    const UserWaterData = require('./userwaterdata.model');

    const targetWater = Math.round(parseFloat(doc.waterNeeded) * 1000);

    await UserWaterData.findOneAndUpdate(
        { userId: doc.userId },
        { target: targetWater }
    );
});


module.exports = mongoose.model('Calculate', calcuSchema);
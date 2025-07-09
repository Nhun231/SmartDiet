const express = require('express');
const router = express.Router();
const tdeeController = require('../controllers/calculate.controller');
const dietPlanController = require('../controllers/dietplan.controller');
const { validateCalculate } = require('../validations/calculate.validator');
const verifyJWTs = require('../middlewares/verifyJWTs');
const allowRoles = require("../middlewares/allowedRole");

/**
 * @swagger
 * tags:
 *   name: Tính chỉ số
 *   description: API tính TDEE, BMR, BMI
 *
 * /customers/calculate:
 *   post:
 *     summary: Tính toán TDEE, BMR và BMI
 *     tags: [Tính chỉ số]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - gender
 *               - age
 *               - height
 *               - weight
 *               - activity
 *             properties:
 *               userId:
 *               type: string
 *               gender:
 *                 type: string
 *                 enum: [Nam, Nữ]
 *               age:
 *                 type: number
 *               height:
 *                 type: number
 *                 description: Chiều cao (cm)
 *               weight:
 *                 type: number
 *                 description: Cân nặng (kg)
 *               activity:
 *                 type: string
 *                 description: Mức độ vận động (ít, nhẹ, vừa, nhiều, cực_nhiều)
 *     responses:
 *       200:
 *         description: Kết quả tính toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bmr:
 *                   type: number
 *                 tdee:
 *                   type: number
 *                 bmi:
 *                   type: number
 */

router.post('/calculate', verifyJWTs, validateCalculate, tdeeController.calculateTDEE);
/**
 * @swagger
 * /calculate/newest:
 *   get:
 *     summary: Lấy dữ liệu tính toán mới nhất của người dùng
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu calculate gần đây nhất
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     bmr:
 *                       type: number
 *                     tdee:
 *                       type: number
 *                     bmi:
 *                       type: number
 *                     waterIntake:
 *                       type: number
 *                     age:
 *                       type: number
 *                     gender:
 *                       type: string
 *                     height:
 *                       type: number
 *                     weight:
 *                       type: number
 *                     activity:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Thiếu hoặc sai token xác thực
 *       404:
 *         description: Không có dữ liệu tính toán hoặc không tìm thấy người dùng
 *       500:
 *         description: Lỗi phía server
 */
router.get('/calculate/newest', verifyJWTs, tdeeController.getNewestCalculateByEmail);
router.get('/calculate/history', verifyJWTs, tdeeController.getAllCalculationsByUserId);

router.post('/dietplan/create', verifyJWTs,dietPlanController.generateDietPlan);
router.put('/dietplan/update',verifyJWTs, dietPlanController.updateDietPlan);
module.exports = router;
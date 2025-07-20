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
 *   - name: Calculate
 *     description: API tính toán TDEE, BMR, BMI

 * customer/calculate:
 *   post:
 *     summary: Tính toán TDEE, BMR, BMI và các chỉ số dinh dưỡng
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gender
 *               - age
 *               - height
 *               - weight
 *               - activity
 *             properties:
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
 *                 enum: [ít, nhẹ, vừa, nhiều, cực_nhiều]
 *                 description: Mức độ vận động
 *     responses:
 *       200:
 *         description: Kết quả tính toán thành công
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
 *                 waterIntake:
 *                   type: string
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     protein:
 *                       type: number
 *                     fat:
 *                       type: number
 *                     carbs:
 *                       type: number
 */

router.post('/calculate', verifyJWTs, validateCalculate, tdeeController.calculateTDEE);
/**
 * @swagger
 * /customer/calculate/newest:
 *   get:
 *     summary: Lấy dữ liệu tính toán mới nhất của người dùng
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu calculate mới nhất
 *         content:
 *           application/json:
 *             schema:
 *                   type: object
 *                   properties:
 *                     bmr:
 *                       type: number
 *                     tdee:
 *                       type: number
 *                     bmi:
 *                       type: number
 *                     waterIntake:
 *                   type: string
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
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     carbPercent:
 *                       type: number
 *                     proteinPercent:
 *                       type: number
 *                     fatPercent:
 *                       type: number
 *                     fiberPercent:
 *                       type: number
 *                 proteinGram:
 *                   type: number
 *                 fatGram:
 *                   type: number
 *                 carbGram:
 *                   type: number
 *                 fiberGram:
 *                   type: number
 *                 proteinKcal:
 *                   type: number
 *                 fatKcal:
 *                   type: number
 *                 carbKcal:
 *                   type: number
 *                 fiberKcal:
 *                   type: number
 *       401:
 *         description: Không xác thực
 *       404:
 *         description: Không tìm thấy dữ liệu
 */
router.get('/calculate/newest', verifyJWTs, tdeeController.getNewestCalculateByEmail);

/**
 * @swagger
 * /customer/calculate/update-nutrition:
 *   patch:
 *     summary: Cập nhật % Nutrition (Carbs, Protein, Fat)
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proteinPercent
 *               - fatPercent
 *               - carbPercent
 *             properties:
 *               proteinPercent:
 *                 type: number
 *               fatPercent:
 *                 type: number
 *               carbPercent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 protein:
 *                   type: number
 *                 fat:
 *                   type: number
 *                 carbs:
 *                   type: number
 *                fiber:
 *                   type: number
 *       400:
 *         description: Tổng % không hợp lệ
 *       404:
 *         description: Không tìm thấy dữ liệu
 */
router.patch('/calculate/update-nutrition', verifyJWTs, tdeeController.updateNutrition);
// router.patch('/calculate/update-nutrition', tdeeController.updateNutrition);

/**
 * @swagger
 * /customer/calculate/history:
 *   get:
 *     summary: Lấy toàn bộ lịch sử tính toán chỉ số theo user
 *     tags: [Calculate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Lọc theo thời gian (7 ngày, 30 ngày, 365 ngày)
 *     responses:
 *       200:
 *         description: Lịch sử tính toán theo thời gian
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       height:
 *                         type: number
 *                       weight:
 *                         type: number
 *                       bmi:
 *                         type: number
 *                       tdee:
 *                         type: number
 *                       bmr:
 *                         type: number
 *                       waterIntake:
 *                         type: string
 *       404:
 *         description: Không có dữ liệu tính toán nào cho người dùng này.
 *       500:
 *         description: Lỗi phía server
 */
router.get('/calculate/history', verifyJWTs, tdeeController.getAllCalculationsByUserId);

/**
 * @swagger
 * /customer/dietplan/get-current:
 *   get:
 *     summary: Lấy kế hoạch ăn kiêng hiện tại của người dùng
 *     tags: [DietPlan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kế hoạch ăn kiêng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       404:
 *         description: Không tìm thấy kế hoạch ăn kiêng
 *       500:
 *         description: Lỗi phía server
 */
router.get('/dietplan/get-current', verifyJWTs,dietPlanController.getCurrentDietPlan)

/**
 * @swagger
 * /customer/dietplan/create:
 *   post:
 *     summary: Tạo kế hoạch ăn kiêng mới
 *     tags: [DietPlan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - goal
 *             properties:
 *               goal:
 *                 type: string
 *                 enum: [lose, keep, gain]
 *                 example: lose
 *               targetWeightChange:
 *                 type: number
 *                 example: 3
 *                 description: Số kg muốn tăng/giảm (bắt buộc nếu goal là lose/gain)
 *     responses:
 *       200:
 *         description: Kế hoạch ăn kiêng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi phía server
 */
router.post('/dietplan/create', verifyJWTs,dietPlanController.generateDietPlan);

/**
 * @swagger
 * /customer/dietplan/update:
 *   put:
 *     summary: Cập nhật kế hoạch ăn kiêng
 *     tags: [DietPlan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - goal
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 665f3ccbe6f7f1a9ef300001
 *               goal:
 *                 type: string
 *                 enum: [lose, keep, gain]
 *                 example: keep
 *               targetWeightChange:
 *                 type: number
 *                 example: 2
 *                 description: Số kg muốn tăng/giảm (bắt buộc nếu goal là lose/gain)
 *     responses:
 *       200:
 *         description: Kế hoạch ăn kiêng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietPlan'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy kế hoạch ăn kiêng
 *       500:
 *         description: Lỗi phía server
 */
router.put('/dietplan/update',verifyJWTs, dietPlanController.updateDietPlan);
module.exports = router;
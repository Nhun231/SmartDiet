const express = require('express');
const router = express.Router();
const tdeeController = require('../controllers/calculate.controller');
const { validateCalculate } = require('../validations/calculate.validator');

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
 *               - email
 *               - gender
 *               - age
 *               - height
 *               - weight
 *               - activity
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: example@gmail.com
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

router.post('/calculate', validateCalculate, tdeeController.calculateTDEE);

module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/waterTracking.controller');
const verifyJWTs = require('../middlewares/verifyJWTs');

router.use(verifyJWTs);
/**
 * @swagger
 * /smartdiet/water-reminders/water-data:
 *   get:
 *     summary: Lấy dữ liệu nước uống trong ngày của người dùng
 *     tags: [WaterReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu nước uống, tạo bản ghi mới nếu đây là lần đầu vào trang trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 1200
 *                 target:
 *                   type: number
 *                   example: 2000
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         example: "10:30"
 *                       amount:
 *                         type: number
 *                         example: 200
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/water-data', controller.getWaterData);
/**
 * @swagger
 * /smartdiet/water-reminders/add-water:
 *   post:
 *     summary: Ghi nhận lần uống nước của người dùng
 *     tags: [WaterReminder]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - time
 *               - amount
 *             properties:
 *               time:
 *                 type: string
 *                 example: "14:00"
 *               amount:
 *                 type: number
 *                 example: 250
 *     responses:
 *       200:
 *         description: Thêm dữ liệu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */

router.post('/add-water', controller.addWater);
/**
 * @swagger
 * /smartdiet/water-reminders/update-target:
 *   put:
 *     summary: Cập nhật mục tiêu uống nước trong ngày
 *     tags: [WaterReminder]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - target
 *             properties:
 *               target:
 *                 type: number
 *                 example: 2200
 *     responses:
 *       200:
 *         description: Cập nhật mục tiêu thành công
 *       400:
 *         description: Dữ liệu mục tiêu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.put('/update-target', controller.updateTarget);

module.exports = router;

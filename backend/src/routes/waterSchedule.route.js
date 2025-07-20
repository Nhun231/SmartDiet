const express = require('express');
const router = express.Router();
const waterReminderController = require('../controllers/waterReminderSetting.controller');

// Middleware xác thực (nếu có auth)
const verifyJWTs = require('../middlewares/verifyJWTs');
// Hàm này thường dùng cho cron job, không phải từ client
/**
 * @swagger
 * /water-reminders/send-reminders:
 *   post:
 *     summary: Gửi thông báo nhắc nhở uống nước (dùng cho hệ thống/cron job)
 *     tags: [WaterReminder]
 *     responses:
 *       200:
 *         description: Gửi nhắc nhở thành công
 *       500:
 *         description: Lỗi server
 */
router.post('/send-reminders', waterReminderController.sendReminders);
router.use(verifyJWTs);

// Cập nhật hoặc tạo reminder setting
/**
 * @swagger
 * /water-reminders/reminder-setting:
 *   post:
 *     summary: Cập nhật hoặc tạo cài đặt nhắc nhở uống nước
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
 *               - wakeUpTime
 *               - sleepTime
 *               - reminderGap
 *               - expoPushToken
 *               - schedule
 *             properties:
 *               wakeUpTime:
 *                 type: string
 *                 example: "06:00"
 *               sleepTime:
 *                 type: string
 *                 example: "23:00"
 *               reminderGap:
 *                 type: integer
 *                 example: 90
 *               expoPushToken:
 *                 type: string
 *                 example: "ExponentPushToken[xxxxxxxxxxx]"
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "08:30"
 *                     amount:
 *                       type: string
 *                       example: "200ml"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/reminder-setting', waterReminderController.updateReminderSetting);

// Lấy lịch trình nhắc uống nước
/**
 * @swagger
 * /water-reminders/reminder-schedule:
 *   get:
 *     summary: Lấy lịch trình nhắc uống nước của người dùng
 *     tags: [WaterReminder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu lịch trình
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wakeUpTime:
 *                   type: string
 *                   example: "06:00"
 *                 sleepTime:
 *                   type: string
 *                   example: "23:00"
 *                 reminderGap:
 *                   type: integer
 *                   example: 90
 *                 schedule:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         example: "08:30"
 *                       amount:
 *                         type: string
 *                         example: "200ml"
 *       404:
 *         description: Không tìm thấy cài đặt
 *       500:
 *         description: Lỗi server
 */
router.get('/reminder-schedule', waterReminderController.getReminderSchedule);

module.exports = router;

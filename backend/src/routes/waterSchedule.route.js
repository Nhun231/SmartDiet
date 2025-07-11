const express = require('express');
const router = express.Router();
const waterReminderController = require('../controllers/waterReminderSetting.controller');

// Middleware xác thực (nếu có auth)
const verifyJWTs = require('../middlewares/verifyJWTs');
// Hàm này thường dùng cho cron job, không phải từ client
router.post('/send-reminders', waterReminderController.sendReminders);
router.use(verifyJWTs);

// Cập nhật hoặc tạo reminder setting
router.post('/reminder-setting', waterReminderController.updateReminderSetting);

// Lấy lịch trình nhắc uống nước
router.get('/reminder-schedule', waterReminderController.getReminderSchedule);



module.exports = router;

const WaterReminderSetting = require('../models/waterReminderSetting.model');
const { generateSchedule } = require('../utils/generateSchedule');
const { sendPushNotification } = require('./expoPush.service');

exports.updateSetting = async (userId, data) => {
    return await WaterReminderSetting.findOneAndUpdate(
        { userId },
        data,
        { new: true, upsert: true }
    );
};

exports.getSetting = async (userId) => {
    return await WaterReminderSetting.findOne({ userId });
};

exports.getSchedule = (setting) => {
    return generateSchedule(setting.wakeUpTime, setting.sleepTime, setting.reminderGap);
};

exports.sendReminders = async () => {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const settings = await WaterReminderSetting.find();
    for (const setting of settings) {
        console.log(`User ${setting.userId}: wakeUpTime = ${setting.wakeUpTime}, sleepTime = ${setting.sleepTime}, reminderGap = ${setting.reminderGap}`);
        const schedule = setting.schedule;
        // // Log kết quả so sánh cho từng khoảng thời gian trong lịch
        // for (const item of schedule) {
        //     const isMatch = (item.time === currentTimeStr);
        //     console.log(`So sánh: Thời gian nhắc ${item.time} và thời gian hiện tại ${currentTimeStr} => ${isMatch ? "Trùng khớp" : "Không trùng"}`);
        // }

        // Tìm mục trong lịch mà trùng khớp với thời gian hiện tại
        const match = schedule.find(item => item.time === currentTimeStr);

        if (match && setting.expoPushToken && setting.expoPushToken.startsWith('ExponentPushToken')) {
            try {
                await sendPushNotification(
                    setting.expoPushToken,
                    '💧 Nhắc nhở uống nước',
                    `Đã đến lúc uống ${match.amount} nước!`,
                    { type: 'water-reminder' }
                );
                console.log(`Đã gửi nhắc nhở cho user ${setting.userId} với token ${setting.expoPushToken} lúc ${currentTimeStr}`);
            } catch (err) {
                console.error(`Lỗi gửi nhắc nhở cho user ${setting.userId}:`, err.message);
            }
        }
    }
};

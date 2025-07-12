const reminderService = require('../services/waterReminder.service');
const catchAsync = require('../utils/catchAsync');
const { generateSchedule } = require('../utils/generateSchedule');
// 1. Cập nhật cài đặt nhắc nhở
exports.updateReminderSetting = catchAsync(async (req, res) => {
    const userId = req.user?.id || '684c019b2466626c52af67b7';
    console.log(userId)
    const setting = await reminderService.updateSetting(userId, req.body);
    res.status(200).json(setting);
});

// 2. Lấy lịch nhắc nhở theo setting
exports.getReminderSchedule = catchAsync(async (req, res) => {
    const userId = req.user?.id || '684c019b2466626c52af67b7';

    let setting = await reminderService.getSetting(userId);

    const isValidSetting =
        setting &&
        typeof setting.wakeUpTime === 'string' &&
        typeof setting.sleepTime === 'string' &&
        typeof setting.reminderGap === 'number';

    if (!isValidSetting) {
        // Nếu không tồn tại hoặc setting không hợp lệ, tạo mới
        const defaultWakeUp = '06:00';
        const defaultSleep = '23:00';
        const defaultGap = 90;
        const schedule = generateSchedule(defaultWakeUp, defaultSleep, defaultGap);

        // Nếu chưa có thì tạo mới
        if (!setting) {
            setting = await WaterReminderSetting.create({
                userId,
                wakeUpTime: defaultWakeUp,
                sleepTime: defaultSleep,
                reminderGap: defaultGap,
                schedule,
            });
        } else {
            // Nếu có nhưng thiếu dữ liệu, thì update lại
            setting.wakeUpTime = defaultWakeUp;
            setting.sleepTime = defaultSleep;
            setting.reminderGap = defaultGap;
            setting.schedule = schedule;
            await setting.save();
        }

        console.log('Tạo setting mặc định cho user:', userId);
    }

    res.status(200).json({
        wakeUpTime: setting.wakeUpTime,
        sleepTime: setting.sleepTime,
        reminderGap: setting.reminderGap,
        schedule: setting.schedule,
    });
});


exports.sendReminders = async () => {
    try {
        await reminderService.sendReminders();
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
};

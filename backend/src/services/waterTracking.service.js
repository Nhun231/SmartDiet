const User = require('../models/user.model');
const Calculate = require('../models/calculate.model');
const UserWaterData = require('../models/userwaterdata.model');

const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

exports.getWaterData = async (req, res) => {
    try {
        const email = req.user.email; // Email lấy từ token
        const today = getTodayDate();

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Tìm dữ liệu nước theo userId
        let waterData = await UserWaterData.findOne({ userId: user._id, date: today });

        // Nếu chưa có, tạo mới
        if (!waterData) {
            // Lấy chỉ số nước cần thiết từ Calculate mới nhất
            const latestCalc = await Calculate.findOne({ userId: user._id }).sort({ createdAt: -1 });
            const targetWater = latestCalc ? Math.round(parseFloat(latestCalc.waterNeeded) * 1000) : 2500;

            waterData = new UserWaterData({
                userId: user._id,
                email: user.email,
                date: today,
                target: targetWater,
                consumed: 0,
                unit: 'ml',
                history: []
            });

            await waterData.save();
        }

        res.status(200).json(waterData);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu nước:', err.message);
        res.status(500).json({ message: `Lỗi khi lấy dữ liệu nước: ${err.message}` });
    }
};


exports.addWaterIntake = async (req, res) => {
    try {
        const email = req.user.email;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Lượng nước không hợp lệ.' });
        }

        const today = getTodayDate();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const waterData = await UserWaterData.findOne({ userId: user._id, date: today });
        if (!waterData) {
            return res.status(404).json({ message: 'Chưa có dữ liệu nước cho hôm nay.' });
        }

        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        waterData.consumed += amount;
        waterData.history.unshift({ time, amount });

        await waterData.save();

        res.status(200).json(waterData);
    } catch (err) {
        console.error('Lỗi khi thêm lượng nước:', err.message);
        res.status(500).json({ message: `Lỗi khi thêm lượng nước: ${err.message}` });
    }
};


exports.updateTarget = async (req, res) => {
    try {
        const email = req.user.email;
        const { target } = req.body;

        if (!target || target <= 0) {
            return res.status(400).json({ message: 'Mục tiêu uống nước không hợp lệ.' });
        }

        const today = getTodayDate();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const waterData = await UserWaterData.findOneAndUpdate(
            { userId: user._id, date: today },
            { target },
            { new: true }
        );

        if (!waterData) {
            return res.status(404).json({ message: 'Chưa có dữ liệu nước để cập nhật.' });
        }

        res.status(200).json(waterData);
    } catch (err) {
        console.error('Lỗi khi cập nhật target:', err.message);
        res.status(500).json({ message: `Lỗi khi cập nhật target: ${err.message}` });
    }
};

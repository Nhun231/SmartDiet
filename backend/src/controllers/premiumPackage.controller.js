const { StatusCodes } = require('http-status-codes');
const PremiumPackage = require('../models/premiumPackage.model');
const User = require('../models/user.model');
const BaseError = require('../utils/BaseError');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/premium-packages:
 *   get:
 *     summary: Lấy danh sách tất cả gói premium
 *     tags: [Premium Packages]
 *     responses:
 *       200:
 *         description: Danh sách gói premium
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PremiumPackage'
 */
const getAllPremiumPackages = catchAsync(async (req, res) => {
    const packages = await PremiumPackage.find({ isActive: true }).sort({ level: 1 });
    
    res.status(StatusCodes.OK).json({
        success: true,
        data: packages
    });
});

/**
 * @swagger
 * /api/premium-packages/{id}:
 *   get:
 *     summary: Lấy thông tin gói premium theo ID
 *     tags: [Premium Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin gói premium
 *       404:
 *         description: Không tìm thấy gói premium
 */
const getPremiumPackageById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const package = await PremiumPackage.findById(id);
    
    if (!package) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
    }
    
    res.status(StatusCodes.OK).json({
        success: true,
        data: package
    });
});

/**
 * @swagger
 * /api/premium-packages/level/{level}:
 *   get:
 *     summary: Lấy thông tin gói premium theo level
 *     tags: [Premium Packages]
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Thông tin gói premium
 *       404:
 *         description: Không tìm thấy gói premium
 */
const getPremiumPackageByLevel = catchAsync(async (req, res) => {
    const { level } = req.params;
    const package = await PremiumPackage.findOne({ level: parseInt(level), isActive: true });
    
    if (!package) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium với level này');
    }
    
    res.status(StatusCodes.OK).json({
        success: true,
        data: package
    });
});

/**
 * @swagger
 * /api/premium-packages:
 *   post:
 *     summary: Tạo gói premium mới (Admin only)
 *     tags: [Premium Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiumPackage'
 *     responses:
 *       201:
 *         description: Tạo gói premium thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
const createPremiumPackage = catchAsync(async (req, res) => {
    const packageData = req.body;
    
    // Check if level already exists
    const existingPackage = await PremiumPackage.findOne({ level: packageData.level });
    if (existingPackage) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Level này đã tồn tại');
    }
    
    const newPackage = await PremiumPackage.create(packageData);
    
    res.status(StatusCodes.CREATED).json({
        success: true,
        data: newPackage
    });
});

/**
 * @swagger
 * /api/premium-packages/{id}:
 *   put:
 *     summary: Cập nhật gói premium (Admin only)
 *     tags: [Premium Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PremiumPackage'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy gói premium
 */
const updatePremiumPackage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const package = await PremiumPackage.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    });
    
    if (!package) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
    }
    
    res.status(StatusCodes.OK).json({
        success: true,
        data: package
    });
});

/**
 * @swagger
 * /api/premium-packages/{id}:
 *   delete:
 *     summary: Xóa gói premium (Admin only)
 *     tags: [Premium Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy gói premium
 */
const deletePremiumPackage = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const package = await PremiumPackage.findByIdAndDelete(id);
    
    if (!package) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
    }
    
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Xóa gói premium thành công'
    });
});

/**
 * @swagger
 * /api/premium-packages/upgrade:
 *   post:
 *     summary: Nâng cấp gói premium cho user
 *     tags: [Premium Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *               paymentMethod:
 *                 type: string
 *                 enum: [coins, card, bank]
 *     responses:
 *       200:
 *         description: Nâng cấp thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
const upgradeUserPackage = catchAsync(async (req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        throw new BaseError(StatusCodes.UNAUTHORIZED, 'Người dùng chưa đăng nhập');
    }
    
    const { level, paymentMethod } = req.body;
    const userId = req.user.id;
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
    }
    
    // Get package info
    const package = await PremiumPackage.findOne({ level, isActive: true });
    if (!package) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
    }
    
    // Check if user already has this level or higher
    if (user.level >= level) {
        throw new BaseError(StatusCodes.BAD_REQUEST, 'Bạn đã có gói này hoặc cao hơn');
    }
    
    // Handle payment
    if (paymentMethod === 'coins') {
        if (user.coins < package.price) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'Không đủ xu để mua gói này');
        }
        user.coins -= package.price;
    }
    // For card/bank payment, you would integrate with payment gateway here
    
    // Update user level and expiry
    user.level = level;
    user.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    user.lastResetDate = new Date();
    user.aiChatUsed = 0;
    user.expertChatUsed = 0;
    
    await user.save();
    
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Nâng cấp gói thành công',
        data: {
            level: user.level,
            coins: user.coins,
            premiumExpiry: user.premiumExpiry
        }
    });
});

/**
 * @swagger
 * /api/premium-packages/user/status:
 *   get:
 *     summary: Lấy trạng thái gói premium của user
 *     tags: [Premium Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trạng thái gói premium
 */
const getUserPackageStatus = catchAsync(async (req, res) => {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        throw new BaseError(StatusCodes.UNAUTHORIZED, 'Người dùng chưa đăng nhập');
    }
    
    const userId = req.user.id;
    
    // Get user with all fields, including defaults
    const user = await User.findById(userId);
    if (!user) {
        throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
    }
    
    // Ensure user has premium fields, set defaults if missing
    if (user.level === undefined) user.level = 1;
    if (user.coins === undefined) user.coins = 0;
    if (user.aiChatUsed === undefined) user.aiChatUsed = 0;
    if (user.expertChatUsed === undefined) user.expertChatUsed = 0;
    if (user.lastResetDate === undefined) user.lastResetDate = new Date();
    
    // Save user if we updated any fields
    if (user.isModified()) {
        await user.save();
    }
    
    const package = await PremiumPackage.findOne({ level: user.level, isActive: true });
    
    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            user: {
                level: user.level,
                coins: user.coins,
                premiumExpiry: user.premiumExpiry,
                aiChatUsed: user.aiChatUsed,
                expertChatUsed: user.expertChatUsed,
                lastResetDate: user.lastResetDate
            },
            package: package
        }
    });
});

module.exports = {
    getAllPremiumPackages,
    getPremiumPackageById,
    getPremiumPackageByLevel,
    createPremiumPackage,
    updatePremiumPackage,
    deletePremiumPackage,
    upgradeUserPackage,
    getUserPackageStatus
};

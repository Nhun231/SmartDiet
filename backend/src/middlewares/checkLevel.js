const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const PremiumPackage = require('../models/premiumPackage.model');
const BaseError = require('../utils/BaseError');

/**
 * Middleware to check if user has required level access
 * @param {number} requiredLevel - Minimum level required
 * @param {string} feature - Feature name for error message
 * @returns {Function} Express middleware function
 */
const checkLevel = (requiredLevel, feature = 'tính năng này') => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            
            // Check if user is admin - admins bypass level restrictions
            if (req.user && req.user.role === 'admin') {
                req.userLevel = 3; // Set admin level to 3 for consistency
                req.userPremiumExpiry = null; // No expiry for admins
                next();
                return;
            }
            
            // Get user with level info
            const user = await User.findById(userId).select('level premiumExpiry');
            if (!user) {
                throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
            }
            
            // Check if premium has expired
            if (user.premiumExpiry && user.premiumExpiry < new Date()) {
                // Reset to level 1 if premium expired
                user.level = 1;
                user.premiumExpiry = null;
                await user.save();
            }
            
            // Check level requirement
            if (user.level < requiredLevel) {
                throw new BaseError(
                    StatusCodes.FORBIDDEN, 
                    `Bạn cần nâng cấp lên level ${requiredLevel} để sử dụng ${feature}`
                );
            }
            
            // Add user level info to request
            req.userLevel = user.level;
            req.userPremiumExpiry = user.premiumExpiry;
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Middleware to check if user can use AI chat
 */
const checkAIAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Check if user is admin - admins have unlimited AI access
        if (req.user && req.user.role === 'admin') {
            req.userLevel = 3;
            req.aiChatUsed = 0;
            req.aiChatLimit = null; // Unlimited for admins
            next();
            return;
        }
        
        const user = await User.findById(userId).select('level aiChatUsed premiumExpiry lastResetDate');
        if (!user) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        }
        
        // Check if premium has expired
        if (user.premiumExpiry && user.premiumExpiry < new Date()) {
            user.level = 1;
            user.premiumExpiry = null;
            user.aiChatUsed = 0;
            user.expertChatUsed = 0;
            user.lastResetDate = new Date();
            await user.save();
        }
        
        // Get package info
        const package = await PremiumPackage.findOne({ level: user.level, isActive: true });
        if (!package) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
        }
        
        // Check if user can use AI
        if (!package.canUseAI) {
            throw new BaseError(StatusCodes.FORBIDDEN, 'Gói của bạn không hỗ trợ chat AI');
        }
        
        // Check monthly limit
        const now = new Date();
        const lastReset = new Date(user.lastResetDate);
        const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
        
        if (isNewMonth) {
            // Reset counters for new month
            user.aiChatUsed = 0;
            user.expertChatUsed = 0;
            user.lastResetDate = now;
            await user.save();
        }
        
        // Check if user has reached AI chat limit
        if (package.aiChatLimit && user.aiChatUsed >= package.aiChatLimit) {
            throw new BaseError(StatusCodes.FORBIDDEN, `Bạn đã sử dụng hết ${package.aiChatLimit} lượt chat AI trong tháng này`);
        }
        
        req.userLevel = user.level;
        req.aiChatUsed = user.aiChatUsed;
        req.aiChatLimit = package.aiChatLimit;
        
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to check if user can use expert chat
 */
const checkExpertAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Check if user is admin - admins have unlimited expert access
        if (req.user && req.user.role === 'admin') {
            req.userLevel = 3;
            req.expertChatUsed = 0;
            req.expertChatLimit = null; // Unlimited for admins
            next();
            return;
        }
        
        const user = await User.findById(userId).select('level expertChatUsed premiumExpiry lastResetDate');
        if (!user) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        }
        
        // Check if premium has expired
        if (user.premiumExpiry && user.premiumExpiry < new Date()) {
            user.level = 1;
            user.premiumExpiry = null;
            user.aiChatUsed = 0;
            user.expertChatUsed = 0;
            user.lastResetDate = new Date();
            await user.save();
        }
        
        // Get package info
        const package = await PremiumPackage.findOne({ level: user.level, isActive: true });
        if (!package) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
        }
        
        // Check if user can use expert chat
        if (!package.expertChatLimit || package.expertChatLimit === 0) {
            throw new BaseError(StatusCodes.FORBIDDEN, 'Gói của bạn không hỗ trợ chat với chuyên gia');
        }
        
        // Check monthly limit
        const now = new Date();
        const lastReset = new Date(user.lastResetDate);
        const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
        
        if (isNewMonth) {
            // Reset counters for new month
            user.aiChatUsed = 0;
            user.expertChatUsed = 0;
            user.lastResetDate = now;
            await user.save();
        }
        
        // Check if user has reached expert chat limit
        if (user.expertChatUsed >= package.expertChatLimit) {
            throw new BaseError(StatusCodes.FORBIDDEN, `Bạn đã sử dụng hết ${package.expertChatLimit} lượt chat với chuyên gia trong tháng này`);
        }
        
        req.userLevel = user.level;
        req.expertChatUsed = user.expertChatUsed;
        req.expertChatLimit = package.expertChatLimit;
        
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to check ingredient limit
 */
const checkIngredientLimit = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Check if user is admin - admins bypass ingredient limits
        if (req.user && req.user.role === 'admin') {
            req.userLevel = 3; // Set admin level to 3 for consistency
            req.ingredientLimit = null; // No limit for admins
            next();
            return;
        }
        
        const user = await User.findById(userId).select('level premiumExpiry');
        if (!user) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        }
        
        // Check if premium has expired
        if (user.premiumExpiry && user.premiumExpiry < new Date()) {
            user.level = 1;
            user.premiumExpiry = null;
            await user.save();
        }
        
        // Get package info
        const package = await PremiumPackage.findOne({ level: user.level, isActive: true });
        if (!package) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
        }
        
        // Check ingredient limit
        if (package.ingredientLimit) {
            const Ingredient = require('../models/ingredient.model');
            const ingredientCount = await Ingredient.countDocuments({ userId });
            
            if (ingredientCount >= package.ingredientLimit) {
                throw new BaseError(
                    StatusCodes.FORBIDDEN, 
                    `Bạn đã sử dụng hết ${package.ingredientLimit} nguyên liệu. Nâng cấp gói để sử dụng thêm.`
                );
            }
        }
        
        req.userLevel = user.level;
        req.ingredientLimit = package.ingredientLimit;
        
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to check if user can use coins
 */
const checkCoinsAccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Check if user is admin - admins have unlimited coin access
        if (req.user && req.user.role === 'admin') {
            req.userLevel = 3;
            req.userCoins = 999999; // High coin amount for admins
            next();
            return;
        }
        
        const user = await User.findById(userId).select('level coins premiumExpiry');
        if (!user) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy user');
        }
        
        // Check if premium has expired
        if (user.premiumExpiry && user.premiumExpiry < new Date()) {
            user.level = 1;
            user.premiumExpiry = null;
            await user.save();
        }
        
        // Get package info
        const package = await PremiumPackage.findOne({ level: user.level, isActive: true });
        if (!package) {
            throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy gói premium');
        }
        
        // Check if user can use coins
        if (!package.canUseCoins) {
            throw new BaseError(StatusCodes.FORBIDDEN, 'Gói của bạn không hỗ trợ sử dụng xu giảm giá');
        }
        
        req.userLevel = user.level;
        req.userCoins = user.coins;
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkLevel,
    checkAIAccess,
    checkExpertAccess,
    checkIngredientLimit,
    checkCoinsAccess
};

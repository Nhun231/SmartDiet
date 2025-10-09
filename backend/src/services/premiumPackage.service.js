const PremiumPackage = require('../models/premiumPackage.model');

/**
 * Initialize default premium packages
 */
const initializeDefaultPackages = async () => {
    try {
        // Check if packages already exist
        const existingPackages = await PremiumPackage.find();
        if (existingPackages.length > 0) {
            console.log('Premium packages already initialized');
            return;
        }

        // Create default packages
        const defaultPackages = [
            {
                name: 'Gói tư vấn cơ bản',
                level: 1,
                price: 0,
                description: 'Gói miễn phí với các tính năng cơ bản',
                features: [
                    'Giới hạn nguyên liệu được sử dụng cho menu đồ ăn',
                    'Không được sử dụng tính năng nhận xu của hệ thống',
                    'Không được chat AI'
                ],
                ingredientLimit: 50,
                aiChatLimit: 0,
                expertChatLimit: 0,
                canUseCoins: false,
                canUseAI: false,
                canSuggestDishes: false,
                isActive: true
            },
            {
                name: 'Gói tư vấn chuyên sâu',
                level: 2,
                price: 69000,
                description: 'Gói tư vấn chuyên sâu với nhiều tính năng nâng cao',
                features: [
                    'Được sử dụng đầy đủ các nguyên liệu',
                    'Được chat trực tiếp với Nutrition Expert: 1 câu trong 1 tháng',
                    'Được sử dụng tính năng nhận xu giảm giá',
                    'Được nhận tư vấn từ AI'
                ],
                ingredientLimit: null, // unlimited
                aiChatLimit: null, // unlimited
                expertChatLimit: 1,
                canUseCoins: true,
                canUseAI: true,
                canSuggestDishes: false,
                isActive: true
            },
            {
                name: 'Gói tư vấn nâng cao',
                level: 3,
                price: 189000,
                description: 'Gói tư vấn nâng cao với đầy đủ tính năng',
                features: [
                    'Lượt chat với Nutrition Expert: 20 lượt/tháng',
                    'Lựa chọn từ nguyên liệu có sẵn => đưa vào AI prompt => gợi ý món ăn => gợi ý công thức',
                    'Được sử dụng đầy đủ các nguyên liệu',
                    'Được sử dụng tính năng nhận xu giảm giá',
                    'Được nhận tư vấn từ AI'
                ],
                ingredientLimit: null, // unlimited
                aiChatLimit: null, // unlimited
                expertChatLimit: 20,
                canUseCoins: true,
                canUseAI: true,
                canSuggestDishes: true,
                isActive: true
            }
        ];

        // Insert default packages
        await PremiumPackage.insertMany(defaultPackages);
        console.log('Default premium packages initialized successfully');
        
    } catch (error) {
        console.error('Error initializing default packages:', error);
        throw error;
    }
};

/**
 * Reset user chat counters for new month
 */
const resetMonthlyCounters = async () => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Find users whose last reset was before this month
        const users = await require('../models/user.model').find({
            lastResetDate: { $lt: startOfMonth }
        });
        
        // Reset counters for these users
        await require('../models/user.model').updateMany(
            { lastResetDate: { $lt: startOfMonth } },
            {
                $set: {
                    aiChatUsed: 0,
                    expertChatUsed: 0,
                    lastResetDate: now
                }
            }
        );
        
        console.log(`Reset monthly counters for ${users.length} users`);
        
    } catch (error) {
        console.error('Error resetting monthly counters:', error);
        throw error;
    }
};

/**
 * Check and downgrade expired premium users
 */
const checkExpiredPremium = async () => {
    try {
        const now = new Date();
        
        // Find users with expired premium
        const expiredUsers = await require('../models/user.model').find({
            level: { $gt: 1 },
            premiumExpiry: { $lt: now }
        });
        
        if (expiredUsers.length > 0) {
            // Downgrade to level 1
            await require('../models/user.model').updateMany(
                { level: { $gt: 1 }, premiumExpiry: { $lt: now } },
                {
                    $set: {
                        level: 1,
                        premiumExpiry: null,
                        aiChatUsed: 0,
                        expertChatUsed: 0,
                        lastResetDate: now
                    }
                }
            );
            
            console.log(`Downgraded ${expiredUsers.length} users to level 1 due to expired premium`);
        }
        
    } catch (error) {
        console.error('Error checking expired premium:', error);
        throw error;
    }
};

/**
 * Add coins to user account
 */
const addCoins = async (userId, amount, reason = 'System reward') => {
    try {
        const user = await require('../models/user.model').findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        user.coins += amount;
        await user.save();
        
        console.log(`Added ${amount} coins to user ${userId}. Reason: ${reason}`);
        
        return {
            success: true,
            newBalance: user.coins,
            addedAmount: amount
        };
        
    } catch (error) {
        console.error('Error adding coins:', error);
        throw error;
    }
};

/**
 * Deduct coins from user account
 */
const deductCoins = async (userId, amount, reason = 'Purchase') => {
    try {
        const user = await require('../models/user.model').findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.coins < amount) {
            throw new Error('Insufficient coins');
        }
        
        user.coins -= amount;
        await user.save();
        
        console.log(`Deducted ${amount} coins from user ${userId}. Reason: ${reason}`);
        
        return {
            success: true,
            newBalance: user.coins,
            deductedAmount: amount
        };
        
    } catch (error) {
        console.error('Error deducting coins:', error);
        throw error;
    }
};

module.exports = {
    initializeDefaultPackages,
    resetMonthlyCounters,
    checkExpiredPremium,
    addCoins,
    deductCoins
};

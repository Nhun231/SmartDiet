const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import models
const PremiumPackage = require('../src/models/premiumPackage.model');

const initializePremiumPackages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if packages already exist
        const existingPackages = await PremiumPackage.find();
        if (existingPackages.length > 0) {
            console.log('Premium packages already exist:', existingPackages.length);
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
        const createdPackages = await PremiumPackage.insertMany(defaultPackages);
        console.log('Created premium packages:', createdPackages.length);
        
        // Display created packages
        createdPackages.forEach(pkg => {
            console.log(`- Level ${pkg.level}: ${pkg.name} (${pkg.price === 0 ? 'Free' : pkg.price + ' VND'})`);
        });

    } catch (error) {
        console.error('Error initializing premium packages:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Run the script
if (require.main === module) {
    initializePremiumPackages();
}

module.exports = initializePremiumPackages;

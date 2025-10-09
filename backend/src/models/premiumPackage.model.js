const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     PremiumPackage:
 *       type: object
 *       required:
 *         - name
 *         - level
 *         - price
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: Tên gói premium
 *           example: "Gói tư vấn cơ bản"
 *         level:
 *           type: number
 *           description: Cấp độ gói (1, 2, 3)
 *           example: 1
 *         price:
 *           type: number
 *           description: Giá gói (VND)
 *           example: 0
 *         description:
 *           type: string
 *           description: Mô tả gói
 *           example: "Gói miễn phí với các tính năng cơ bản"
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách tính năng
 *           example: ["Giới hạn nguyên liệu", "Không chat AI"]
 *         ingredientLimit:
 *           type: number
 *           description: Giới hạn số lượng nguyên liệu (null = không giới hạn)
 *           example: 50
 *         aiChatLimit:
 *           type: number
 *           description: Giới hạn lượt chat AI/tháng (null = không giới hạn)
 *           example: 0
 *         expertChatLimit:
 *           type: number
 *           description: Giới hạn lượt chat với chuyên gia/tháng (null = không giới hạn)
 *           example: 0
 *         canUseCoins:
 *           type: boolean
 *           description: Có thể sử dụng xu giảm giá
 *           example: false
 *         canUseAI:
 *           type: boolean
 *           description: Có thể sử dụng AI
 *           example: false
 *         canSuggestDishes:
 *           type: boolean
 *           description: Có thể gợi ý món ăn từ AI
 *           example: false
 *         isActive:
 *           type: boolean
 *           description: Gói có đang hoạt động
 *           example: true
 */
const premiumPackageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    unique: true,
    enum: [1, 2, 3]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  ingredientLimit: {
    type: Number,
    default: null // null = unlimited
  },
  aiChatLimit: {
    type: Number,
    default: 0 // 0 = no access
  },
  expertChatLimit: {
    type: Number,
    default: 0 // 0 = no access
  },
  canUseCoins: {
    type: Boolean,
    default: false
  },
  canUseAI: {
    type: Boolean,
    default: false
  },
  canSuggestDishes: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PremiumPackage = mongoose.model('PremiumPackage', premiumPackageSchema);

module.exports = PremiumPackage;

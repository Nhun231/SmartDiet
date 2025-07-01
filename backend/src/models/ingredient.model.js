const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *         - caloriesPer100g
 *       properties:
 *         name:
 *           type: string
 *           description: Tên nguyên liệu
 *         caloriesPer100g:
 *           type: number
 *           description: Lượng calo trong 100g nguyên liệu
 *         proteinPer100g:
 *           type: number
 *           description: Lượng protein trong 100g (g)
 *         fatPer100g:
 *           type: number
 *           description: Lượng chất béo trong 100g (g)
 *         carbsPer100g:
 *           type: number
 *           description: Lượng carbohydrate trong 100g (g)
 *         fiberPer100g:
 *           type: number
 *           description: Lượng chất xơ trong 100g (g)
 *         category:
 *           type: string
 *           description: Nhóm thực phẩm (thịt, rau củ, trái cây...)
 *         imageUrl:
 *           type: string
 *           description: Đường dẫn ảnh minh họa
 *         description:
 *           type: string
 *           description: Mô tả ngắn về nguyên liệu
 *       example:
 *         name: Ức gà
 *         caloriesPer100g: 165
 *         proteinPer100g: 31
 *         fatPer100g: 3.6
 *         carbsPer100g: 0
 *         fiberPer100g: 0
 *         category: Thịt
 *         imageUrl: https://example.com/chicken.jpg
 *         description: Ức gà không da, giàu protein, ít béo
 */
const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    caloriesPer100g: {
        type: Number,
        required: true
    },
    proteinPer100g: {
        type: Number,
        default: 0
    },
    fatPer100g: {
        type: Number,
        default: 0
    },
    carbsPer100g: {
        type: Number,
        default: 0
    },
    fiberPer100g: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
components:
  schemas:
    Ingredient:
      type: object
      required:
        - name
        - caloriesPer100g
        - userId
      properties:
        _id:
          type: string
          description: ID tự động sinh bởi MongoDB
        name:
          type: string
          description: Tên nguyên liệu
        caloriesPer100g:
          type: number
          description: Lượng calo trong 100g nguyên liệu
        proteinPer100g:
          type: number
          default: 0
          description: Lượng protein trong 100g (g)
        fatPer100g:
          type: number
          default: 0
          description: Lượng chất béo trong 100g (g)
        carbsPer100g:
          type: number
          default: 0
          description: Lượng carbohydrate trong 100g (g)
        fiberPer100g:
          type: number
          default: 0
          description: Lượng chất xơ trong 100g (g)
        category:
          type: string
          default: ''
          description: Nhóm thực phẩm (ví dụ: thịt, rau củ, trái cây)
        imageUrl:
          type: string
          default: ''
          description: Đường dẫn ảnh minh họa
        description:
          type: string
          default: ''
          description: Mô tả ngắn về nguyên liệu
        userId:
          type: string
          description: ID người dùng tạo nguyên liệu
      example:
        _id: 64adf2c1e123456789abcd12
        name: Ức gà
        caloriesPer100g: 165
        proteinPer100g: 31
        fatPer100g: 3.6
        carbsPer100g: 0
        fiberPer100g: 0
        category: Thịt
        imageUrl: https://example.com/chicken.jpg
        description: Ức gà không da, giàu protein, ít béo
        userId: 6872692021692b926c376b00
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
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;

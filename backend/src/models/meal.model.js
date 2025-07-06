const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @swagger
 * components:
 *   schemas:
 *     MealIngredient:
 *       type: object
 *       properties:
 *         ingredientId:
 *           type: string
 *           description: ID của nguyên liệu (ref tới Ingredient)
 *           example: 665f3ccbe6f7f1a9ef308aa2
 *         quantity:
 *           type: number
 *           description: Số gram nguyên liệu được sử dụng
 *           example: 100

 *     Meal:
 *       type: object
 *       required:
 *         - mealType
 *         - date
 *         - ingredients
 *       properties:
 *         mealType:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: Loại bữa ăn
 *           example: lunch
 *         date:
 *           type: string
 *           format: date
 *           description: Ngày của bữa ăn
 *           example: 2025-06-08
 *         ingredients:
 *           type: array
 *           description: Danh sách nguyên liệu
 *           items:
 *             $ref: '#/components/schemas/MealIngredient'
 */
const mealSchema = new Schema({
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  ingredients: [
    {
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Meal", mealSchema);

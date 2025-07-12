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
 * 
 *     MealDish:
 *       type: object
 *       properties:
 *         dishId:
 *           type: string
 *           description: ID của món ăn (ref tới Dish)
 *           example: 668b73f2c2b5fc001e9d38b1
 *         quantity:
 *           type: number
 *           description: Số gram món ăn được sử dụng
 *           example: 200
 * 
 *     Meal:
 *       type: object
 *       required:
 *         - mealType
 *         - date
 *         - userId
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
 *           items:
 *             $ref: '#/components/schemas/MealIngredient'
 *         dish:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MealDish'
 *         totals:
 *           type: object
 *           properties:
 *             calories:
 *               type: number
 *               example: 350
 *             protein:
 *               type: number
 *               example: 30
 *             fat:
 *               type: number
 *               example: 10
 *             carbs:
 *               type: number
 *               example: 40
 *             fiber:
 *               type: number
 *               example: 5
 *         userId:
 *           type: string
 *           description: ID người dùng
 *           example: 665f3ccbe6f7f1a9ef308aa1
 */

const mealSchema = new Schema({
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  ingredients: [
    {
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  dish: [
    {
      dishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Meal", mealSchema);

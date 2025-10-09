const mongoose = require("mongoose");

// /**
//  * @swagger
// components:
//   schemas:
//     Dish:
//       type: object
//       required:
//         - name
//         - ingredients
//         - userId
//       properties:
//         _id:
//           type: string
//           description: ID của món ăn
//         name:
//           type: string
//           description: Tên món ăn
//         description:
//           type: string
//           description: Mô tả ngắn gọn về món ăn
//         ingredients:
//           type: array
//           description: Danh sách nguyên liệu và số lượng tương ứng
//           items:
//             type: object
//             required:
//               - ingredientId
//               - quantity
//             properties:
//               ingredientId:
//                 type: string
//                 description: ID của nguyên liệu
//               quantity:
//                 type: number
//                 minimum: 1
//                 description: Khối lượng nguyên liệu (gram)
//         totals:
//           type: object
//           description: Tổng giá trị dinh dưỡng của món ăn
//           properties:
//             calories:
//               type: number
//               default: 0
//               description: Tổng calo
//             protein:
//               type: number
//               default: 0
//               description: Tổng protein (g)
//             fat:
//               type: number
//               default: 0
//               description: Tổng chất béo (g)
//             carbs:
//               type: number
//               default: 0
//               description: Tổng carbohydrate (g)
//             fiber:
//               type: number
//               default: 0
//               description: Tổng chất xơ (g)
//         userId:
//           type: string
//           description: ID của người tạo món ăn
//         type:
//           type: string
//           enum: [dish]
//           default: dish
//           description: Kiểu phân loại ("dish" để phân biệt với nguyên liệu)
//         createdAt:
//           type: string
//           format: date-time
//           description: Thời điểm tạo món ăn
//       example:
//         _id: 6871cd740859a7bfc82fe318
//         name: Test
//         description: Test dish
//         ingredients:
//           - ingredientId: 68708733d8497c26e71934f5
//             quantity: 100
//           - ingredientId: 6871231fd8497c26e7193d63
//             quantity: 100
//         totals:
//           calories: 400
//           protein: 23
//           fat: 105
//           carbs: 22
//           fiber: 50
//         userId: 6869526d48da154a6eeb21ef
//         type: dish
//         createdAt: 2025-07-12T07:12:00Z

//  */

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },

  description: String,

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
        min: 1
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
  type: {
    type: String,
    enum: ["dish"],
    default: "dish", // 💡 để phân biệt với ingredient
  },
  createdAt: { type: Date, default: Date.now },
});
const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish

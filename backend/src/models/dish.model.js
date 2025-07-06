const mongoose = require("mongoose");

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
        type: Number, // tính theo gram
        required: true,
        min: 1
      },
    },
  ],

  totals: {
    calories: { type: Number, default: 0 },
    protein:  { type: Number, default: 0 },
    fat:      { type: Number, default: 0 },
    carbs:    { type: Number, default: 0 },
    fiber:    { type: Number, default: 0 },
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dish", dishSchema);

const Ingredient = require("../models/ingredient.model");

const calculateNutrition = async (ingredients) => {
  const totals = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };

  for (const item of ingredients) {
    const ing = await Ingredient.findById(item.ingredientId).lean();
    if (!ing) continue;

    const factor = item.quantity / 100;
    totals.calories += ing.caloriesPer100g * factor;
    totals.protein  += ing.proteinPer100g  * factor;
    totals.fat      += ing.fatPer100g      * factor;
    totals.carbs    += ing.carbsPer100g    * factor;
    totals.fiber    += ing.fiberPer100g    * factor;
  }

  // Làm tròn 1 chữ số
  Object.keys(totals).forEach((k) => totals[k] = +totals[k].toFixed(1));
  return totals;
};

module.exports = calculateNutrition;

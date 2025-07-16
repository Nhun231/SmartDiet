const Router = require('express').Router;
const router = Router();
const mealController = require('../controllers/meal.controller');

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MealIngredient:
 *       type: object
 *       required:
 *         - ingredientId
 *         - quantity
 *       properties:
 *         ingredientId:
 *           type: string
 *           description: ID of the ingredient
 *           example: 665f3ccbe6f7f1a9ef308aa2
 *         quantity:
 *           type: number
 *           description: Quantity in grams
 *           example: 100
 *     MealDish:
 *       type: object
 *       required:
 *         - dishId
 *         - quantity
 *       properties:
 *         dishId:
 *           type: string
 *           description: ID of the dish
 *           example: 665f3ccbe6f7f1a9ef308bb3
 *         quantity:
 *           type: number
 *           description: Quantity in grams
 *           example: 150
 *     NutritionTotals:
 *       type: object
 *       properties:
 *         calories:
 *           type: number
 *           description: Total calories
 *           example: 400
 *         protein:
 *           type: number
 *           description: Total protein (g)
 *           example: 35
 *         fat:
 *           type: number
 *           description: Total fat (g)
 *           example: 10
 *         carbs:
 *           type: number
 *           description: Total carbohydrates (g)
 *           example: 50
 *         fiber:
 *           type: number
 *           description: Total fiber (g)
 *           example: 5
 *     Meal:
 *       type: object
 *       required:
 *         - mealType
 *         - date
 *         - userId
 *         - ingredients
 *         - dish
 *       properties:
 *         mealType:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: Type of meal
 *           example: lunch
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the meal
 *           example: 2025-07-16
 *         userId:
 *           type: string
 *           description: ID of the user
 *           example: 665f3ccbe6f7f1a9ef300001
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MealIngredient'
 *         dish:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MealDish'
 *         totals:
 *           $ref: '#/components/schemas/NutritionTotals'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created time
 */

/**
 * @swagger
 * /meals:
 *   post:
 *     summary: Create a new meal
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', mealController.createMeal);

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals by userId
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of meals
 *       400:
 *         description: Missing userId
 *       500:
 *         description: Internal server error
 */
router.get('/', mealController.getAllMeals);

/**
 * @swagger
 * /meals/by-date:
 *   get:
 *     summary: Get meal by date and type
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the meal (e.g. 2025-07-16)
 *       - in: query
 *         name: mealType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *         description: Meal type
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Meal found
 *       400:
 *         description: Missing date, mealType or userId
 *       404:
 *         description: No meal found
 *       500:
 *         description: Internal server error
 */
router.get('/by-date', mealController.getMealByDate);

/**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Get meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal found
 *       404:
 *         description: Meal not found
 */
router.get('/:id', mealController.getMealById);

/**
 * @swagger
 * /meals/{id}:
 *   put:
 *     summary: Update meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       200:
 *         description: Meal updated
 *       404:
 *         description: Meal not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', mealController.updateMeal);

/**
 * @swagger
 * /meals/{id}:
 *   delete:
 *     summary: Delete meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal deleted
 *       404:
 *         description: Meal not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', mealController.deleteMeal);

module.exports = router;

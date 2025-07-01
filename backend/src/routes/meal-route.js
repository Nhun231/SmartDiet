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
 *       properties:
 *         ingredientId:
 *           type: string
 *           description: ID of the ingredient
 *           example: 665f3ccbe6f7f1a9ef308aa2
 *         quantity:
 *           type: number
 *           description: Quantity in grams
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
 *           description: Type of meal
 *           example: lunch
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the meal
 *           example: 2025-06-08
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MealIngredient'
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
 *       500:
 *         description: Internal server error
 */
router.post('/', mealController.createMeal);

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: List of meals
 */
router.get('/', mealController.getAllMeals);

/**
 * @swagger
 * /meals/by-date:
 *   get:
 *     summary: Get meals by date and optional meal type
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the meal (e.g. 2025-06-08)
 *       - in: query
 *         name: mealType
 *         schema:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *         description: Optional meal type to filter
 *     responses:
 *       200:
 *         description: Meals for given date (and optionally type)
 *       404:
 *         description: No meals found
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
 *         description: Meal ID
 *         schema:
 *           type: string
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
 *         description: Meal ID
 *         schema:
 *           type: string
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
 *         description: Meal ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal deleted
 *       404:
 *         description: Meal not found
 */
router.delete('/:id', mealController.deleteMeal);



module.exports = router;

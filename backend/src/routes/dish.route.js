const Router = require('express').Router;
const router = Router();
const dishController = require('../controllers/dish.controller');

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Dish management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - ingredients
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Dish name
 *         description:
 *           type: string
 *           description: Description of the dish
 *         userId:
 *           type: string
 *           description: ID of the user who created the dish
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ingredientId:
 *                 type: string
 *                 description: ID of the ingredient
 *               quantity:
 *                 type: number
 *                 description: Quantity in grams
 *       example:
 *         name: Salad gà
 *         description: Món salad giảm cân
 *         userId: 6687bc000c1d5d2f5ef6b123
 *         ingredients:
 *           - ingredientId: 6843c3369b3b70a5b159b18d
 *             quantity: 150
 */

/**
 * @swagger
 * /dish:
 *   post:
 *     summary: Create a new dishes
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       201:
 *         description: Dish created successfully
 */
router.post('/', dishController.createDish);

/**
 * @swagger
 * /dish:
 *   get:
 *     summary: Get all dishes by userId
 *     tags: [Dishes]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: User ID to filter dishes
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of dishes by user
 */
router.get('/', dishController.getAllDishesByUser);

/**
 * @swagger
 * /dish/{id}:
 *   get:
 *     summary: Get a dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Dish ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish found
 *       404:
 *         description: Dish not found
 */
router.get('/:id', dishController.getDishById);

/**
 * @swagger
 * /dish/{id}:
 *   put:
 *     summary: Update dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Dish ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Dish updated
 *       404:
 *         description: Dish not found
 */
router.put('/:id', dishController.updateDishById);

/**
 * @swagger
 * /dish/{id}:
 *   delete:
 *     summary: Delete dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Dish ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dish deleted
 *       404:
 *         description: Dish not found
 */
router.delete('/:id', dishController.deleteDishById);

module.exports = router;

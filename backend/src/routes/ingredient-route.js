const Router = require('express').Router;
const router = Router();
const ingredientController = require('../controllers/ingredient.controller');
const verifyJWTs = require('../middlewares/verifyJWTs');
const { checkIngredientLimit } = require('../middlewares/checkLevel');

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Ingredient management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *         - calories
 *         - unit
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Ingredient name
 *         calories:
 *           type: number
 *           description: Calories per unit
 *         unit:
 *           type: string
 *           description: Measurement unit (e.g. grams, ml)
 *       example:
 *         name: Carrot
 *         calories: 41
 *         unit: grams
 */

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyJWTs, checkIngredientLimit, ingredientController.createIngredient);

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of ingredients
 */
router.get('/', verifyJWTs, ingredientController.getAllIngredients);

/**
 * @swagger
 * /ingredients/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient found
 *       404:
 *         description: Ingredient not found
 */
router.get('/:id', ingredientController.getIngredientById);

/**
 * @swagger
 * /ingredients/{id}:
 *   put:
 *     summary: Update ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient IDq
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       200:
 *         description: Ingredient updated
 *       404:
 *         description: Ingredient not found
 */
router.put('/:id', ingredientController.updateIngredientById);

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Delete ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ingredient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredient deleted
 *       404:
 *         description: Ingredient not found
 */
router.delete('/:id', ingredientController.deleteIngredientById);

module.exports = router;

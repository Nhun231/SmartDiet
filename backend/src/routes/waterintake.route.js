/**
 * @swagger
 * tags:
 *   name: WaterIntake
 *   description: API for tracking water intake
 */

const Router = require('express').Router;
const router = Router();
const waterIntakeControler = require('../controllers/waterintake.controler');

/**
 * @swagger
 * /water-intake:
 *   post:
 *     summary: Create a new water intake record
 *     tags: [WaterIntake]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: 665f3ccbe6f7f1a9ef300001
 *               amount:
 *                 type: number
 *                 description: Amount of water (ml)
 *                 example: 500
 *     responses:
 *       200:
 *         description: Water intake created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterIntake'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', waterIntakeControler.createWaterIntake);

/**
 * @swagger
 * /water-intake:
 *   get:
 *     summary: Get water intake by userId and date
 *     tags: [WaterIntake]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Water intake record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterIntake'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.get('/', waterIntakeControler.getWaterIntakeByUserIdAndDate);

/**
 * @swagger
 * /water-intake:
 *   put:
 *     summary: Update water intake for a user and date
 *     tags: [WaterIntake]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - date
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: 665f3ccbe6f7f1a9ef300001
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date (YYYY-MM-DD)
 *                 example: 2025-07-16
 *               amount:
 *                 type: number
 *                 description: New amount of water (ml)
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Water intake updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterIntake'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/', waterIntakeControler.updateWaterIntake);

module.exports = router;

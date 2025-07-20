const express = require('express');
const router = express.Router();
const openAIController = require('../controllers/openAI.controller');

/**
 * @swagger
 * tags:
 *   name: OpenAI
 *   description: AI chat endpoints
 */

/**
 * @swagger
 * /ai/chats:
 *   post:
 *     summary: Send a prompt to the AI chatbot
 *     tags: [OpenAI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: User's message to the AI
 *                 example: "What is a healthy diet?"
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "A healthy diet includes a variety of foods..."
 *       500:
 *         description: Failed to generate response
 */
router.post('/chats', openAIController.testAi);

module.exports = router;
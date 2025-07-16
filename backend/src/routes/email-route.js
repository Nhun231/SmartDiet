const Router = require('express').Router;
const router = Router();
const emailController = require('../controllers/email.controller')

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email sending endpoints
 */

/**
 * @swagger
 * /email/send-test-email:
 *   post:
 *     summary: Send a test email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient email address
 *                 example: "user@example.com"
 *               subject:
 *                 type: string
 *                 description: Email subject
 *                 example: "Test Email"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully."
 *       500:
 *         description: Error sending email
 */
router.post('/send-test-email', emailController.sendTestEmail);

/**
 * @swagger
 * /email/welcomeOnboard:
 *   post:
 *     summary: Send welcome onboard email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - to
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               to:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Welcome email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome email sent."
 *       500:
 *         description: Error sending welcome email
 */
router.post('/welcomeOnboard', emailController.sendWelcomeOnboardEmail);

/**
 * @swagger
 * /email/forgotPassword:
 *   post:
 *     summary: Send forgot password email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               token:
 *                 type: string
 *                 example: "reset-token-123"
 *     responses:
 *       200:
 *         description: Forgot password email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgot password email sent."
 *       500:
 *         description: Error sending forgot password email
 */
router.post('/forgotPassword', emailController.sendForgotPasswordEmail);

module.exports = router;
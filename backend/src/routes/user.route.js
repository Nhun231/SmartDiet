/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API cho người dùng
 */

const Router = require('express').Router;
const router = Router();
const userController = require('../controllers/user.controller.js');
const userValidation = require('../validations/user.validator.js');

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: username123
 *               password:
 *                 type: string
 *                 example: Password@1
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *                 format: email
 *               dob:
 *                 type: string
 *                 example: 12/4/1999
 *     responses:
 *       201:
 *         description: Creat user successfully
 *       400:
 *         description: Error creating user email already exists
 */
router.post('/create', userValidation.createUser, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Get all users successfully and returns a list of users
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/find:
 *   get:
 *     summary: Find user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: User's email address to find
 *     responses:
 *       200:
 *         description: Returns user information
 *       404:
 *         description: Not found user with the provided email
 */
router.get('/find', userController.getUserByEmail);

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user's information by email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               dob:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update user successfully
 *       404:
 *         description: User not found with the provided email
 */
router.put('/update', userController.updateUserByEmail);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Hard delete user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User's email address to delete
 *     responses:
 *       200:
 *         description: Delete user successfully
 *       404:
 *         description: User not found with the provided email
 */
router.delete('/delete', userController.deleteUserByEmail);

module.exports = router;

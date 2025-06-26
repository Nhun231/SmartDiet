/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng (login, logout, refresh token, Google login)
 */

const express = require('express');
const authRouter = express.Router();
const oAuthService = require('../services/oauth.service');
const authController = require('../controllers/auth.controller');
const passport = require("passport");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập với email hoặc username và mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrName
 *               - password
 *             properties:
 *               emailOrName:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secretPassword123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken và cookie chứa refreshToken
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Thông tin đăng nhập không chính xác
 */
authRouter.post('/login', authController.login)

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Làm mới access token từ refresh token trong cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Làm mới token thành công, trả về accessToken mới
 *       401:
 *         description: Không tìm thấy cookie hoặc token không hợp lệ
 *       403:
 *         description: Token không khớp với người dùng
 */
authRouter.get('/refresh', authController.refresh)

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Đăng xuất người dùng và xóa cookie chứa refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       204:
 *         description: Không tìm thấy refresh token trong cookie
 */
authRouter.get('/logout', authController.logout)

//redirect to google when click login by
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Đăng nhập với Google (chuyển hướng đến Google)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng tới xác thực Google
 */
authRouter.get("/google", oAuthService.handleLoginByGooglePassport); // middleware to redirect to google

// callback after Google login (choose account, enter password)
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google callback sau khi đăng nhập thành công
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng nhập Google thành công
 *       400:
 *         description: Đăng nhập Google thất bại
 */
authRouter.get('/google/callback', authController.googleCallback);

module.exports = authRouter;

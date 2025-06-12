const express = require('express');
const authRouter = express.Router();
const oAuthService = require('../services/oauth.service');
const authController  = require('../controllers/auth.controller');
const passport = require("passport");




authRouter.post('/login', authController.login)

authRouter.get('/refresh', authController.refresh)

authRouter.get('/logout', authController.logout)

//redirect to google when click login by google
authRouter.get("/google", oAuthService.handleLoginByGooglePassport); // middleware to redirect to google

// callback after Google login (choose account, enter password)
authRouter.get('/google/callback',authController.googleCallback);

module.exports = authRouter;

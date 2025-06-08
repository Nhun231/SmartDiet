const express = require('express');
const authRouter = express.Router();

const authController  = require('../controllers/auth.controller');




authRouter.post('/login', authController.login)

authRouter.get('/refresh', authController.refresh)

authRouter.get('/logout', authController.logout)

module.exports = authRouter;

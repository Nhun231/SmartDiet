const catchAsync = require("../utils/catchAsync");
const authService = require('../services/auth.service');
const oAuthService = require('../services/oauth.service');
const login = catchAsync(async (req, res) => {
     await authService.handleLogin(req, res);
})
const refresh = catchAsync(async (req, res) => {
     await authService.handleRefreshToken(req, res);
})
const logout = catchAsync(async (req, res) => {
     await authService.handleLogout(req, res);
})
const googleCallback = (req, res, next) => {
     oAuthService.handleGoogleCallback(req, res, next);
};
module.exports = {login, refresh, logout, googleCallback};
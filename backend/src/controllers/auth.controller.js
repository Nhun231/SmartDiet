const catchAsync = require("../utils/catchAsync");
const authService = require('../services/auth.service');

const login = catchAsync(async (req, res) => {
     await authService.handleLogin(req, res);
})
const refresh = catchAsync(async (req, res) => {
     await authService.handleRefreshToken(req, res);
})
const logout = catchAsync(async (req, res) => {
     await authService.handleLogout(req, res);
})
module.exports = {login, refresh, logout};
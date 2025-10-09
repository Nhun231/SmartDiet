const openaiService = require('../services/openai.service');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');

const testAi = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    // Generate AI response
    await openaiService.generateResponse(req, res);
    
    // Increment AI chat usage counter
    await User.findByIdAndUpdate(userId, {
        $inc: { aiChatUsed: 1 }
    });
});

module.exports = {
    testAi
};

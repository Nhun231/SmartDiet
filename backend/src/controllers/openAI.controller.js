const openaiService = require('../services/openai.service');
const catchAsync = require('../utils/catchAsync');

const testAi = catchAsync(async (req, res) => {
    await openaiService.generateResponse(req, res);
});

module.exports = {
    testAi
};

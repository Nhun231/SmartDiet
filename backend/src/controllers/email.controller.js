const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/email.service');
const { StatusCodes } = require('http-status-codes');

//send test email
const sendTestEmail = catchAsync(async (req, res) => {
    const result = await emailService.sendTestEmail(req, res);
    res.status(StatusCodes.OK).json({
        message: result
    });
});


//send welcome onboard email
const sendWelcomeOnboardEmail = catchAsync(async (req, res) => {
    const result = await emailService.sendWelcomeOnboardEmail(req.body.username, req.body.to);
    res.status(StatusCodes.OK).json({
        message: result
    });
});

//send forgot password email
const sendForgotPasswordEmail = catchAsync(async (req, res) => {
    console.log('forgot password')
    const result = await emailService.sendForgotPasswordEmail(req.body.email, req.body.token, res);
    res.status(StatusCodes.OK).json({
        message: result
    });
});


module.exports = {
    sendTestEmail,
    sendWelcomeOnboardEmail,
    sendForgotPasswordEmail
};
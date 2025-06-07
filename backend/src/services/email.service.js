const transporter = require('../config/nodeMailer');
const BaseError = require('../utils/baseError.js');
const { StatusCodes } = require('http-status-codes');
const hbsRaw = require('nodemailer-express-handlebars');
const hbs = hbsRaw.__esModule ? hbsRaw.default : hbsRaw;
const path = require('path');
const User = require('../models/user.model.js');

const handlebarOptions = {
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve(__dirname, '../template'),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../template'),
    extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

async function sendTestEmail(req, res) {
    try {
        const result = await transporter.sendMail({
            from: '"SmartDiet" <smartdiet@gmail.com>',
            to: req.body.to,
            subject: req.body.subject || "Test Email",
            template: 'sample',
            context: {
                username: 'Nguyễn Văn A',
            },
        });

        res.status(StatusCodes.OK).json({
            message: result,
        });
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error sending test email: ${error.message}`);
    }
}

async function sendWelcomeOnboardEmail(username, to) {
    try {
        const result = await transporter.sendMail({
            from: '"SmartDiet" <smartdiet@gmail.com>',
            to: to,
            subject: "Welcome Onboard",
            template: 'welcome-onboard',
            context: {
                username: username,
            },
        });
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error sending test email: ${error.message}`);
    }
}

async function sendForgotPasswordEmail(email, token, res) {
    try {
        const user = await User.findOne({ email: email })
        if (user == null) {
            throw new Error(`Email không tồn tại.`)
        }

        console.log(user)
        const result = await transporter.sendMail({
            from: '"SmartDiet" <smartdiet@gmail.com>',
            to: email,
            subject: "Forgot Password",
            template: 'forgot-password',
            context: {
                token: token
            }
        });
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Gửi Email không thành công: ${error.message}`);
    }
}

module.exports = {
    sendTestEmail,
    sendWelcomeOnboardEmail,
    sendForgotPasswordEmail
};

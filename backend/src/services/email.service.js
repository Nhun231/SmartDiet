const transporter = require('../config/nodeMailer');
const BaseError = require('../utils/BaseError.js');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const User = require('../models/user.model.js');

let hbsInitialized = false;

// Tạo hàm khởi tạo handlebars compiler 1 lần duy nhất
async function initHbs() {
    if (hbsInitialized) return;

    const hbsModule = await import('nodemailer-express-handlebars');
    const hbs = hbsModule.default;

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
    hbsInitialized = true;
}

async function sendTestEmail(req, res) {
    try {
        await initHbs();

        const result = await transporter.sendMail({
            from: '"HealthMate" <HealthMate@gmail.com>',
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
        await initHbs();

        await transporter.sendMail({
            from: '"HealthMate" <HealthMate@gmail.com>',
            to: to,
            subject: "Welcome Onboard",
            template: 'welcome-onboard',
            context: {
                username: username,
            },
        });
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error sending welcome email: ${error.message}`);
    }
}

async function sendForgotPasswordEmail(email, token, res) {
    try {
        await initHbs();

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error(`Email không tồn tại.`);
        }

        await transporter.sendMail({
            from: '"HealthMate" <HealthMate@gmail.com>',
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

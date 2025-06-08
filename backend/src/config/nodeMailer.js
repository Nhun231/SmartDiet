const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false
});


module.exports = transporter;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false
});

// const transporter = nodemailer.createTransport({
//   service: 'gmail', 
//   auth: {
//     user: 'binhco2004@gmail.com',
//     pass: ''
//   }
// });


module.exports = transporter;
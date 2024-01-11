const nodemailer = require('nodemailer');

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
                reject(error)
            } else {
                console.log('Email sent:', info.response);
                resolve(info.response)
            }
        });
    })
}

module.exports = sendMail;
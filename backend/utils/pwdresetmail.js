const { gmail } = require("googleapis/build/src/apis/gmail");
const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    //from mailtrop
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        // service: 'gmail',
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

module.exports = sendEmail;
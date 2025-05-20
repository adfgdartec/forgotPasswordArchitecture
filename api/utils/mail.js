const nodemailer = require('nodemailer');

//Nodemailer with Resend SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY
    }
  });

module.exports = transporter;
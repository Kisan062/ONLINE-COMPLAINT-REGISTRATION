const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  const message = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(message);
};

module.exports = sendMail;

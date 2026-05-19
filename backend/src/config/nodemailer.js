const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'vidyavaidyanlr@gmail.com',
    pass: process.env.EMAIL_PASS || 'rnkldklurppaqurr'
  }
});

module.exports = transporter;

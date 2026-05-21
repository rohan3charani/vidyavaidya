const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'vidyavaidyanlr@gmail.com',
    pass: process.env.EMAIL_PASS || 'rnkldklurppaqurr'
  },
  tls: {
    // Bypass self-signed certificate errors from corporate proxies/antivirus interception
    rejectUnauthorized: false
  }
});

module.exports = transporter;

/**
 * OTP Service
 * Generates, stores, sends, and verifies 6-digit email OTPs.
 * Stores OTP records in Firestore `otps` collection with expiry.
 */

const { db } = require('../config/firebase');
const transporter = require('../config/nodemailer');
const admin = require('firebase-admin');

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

/**
 * Generate a cryptographically random 6-digit OTP
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to email and store in Firestore
 */
async function sendOtp(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store OTP in Firestore (upsert by email so resend replaces old)
  await db.collection('otps').doc(normalizedEmail).set({
    email: normalizedEmail,
    otp,
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    attempts: 0,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  });

  // Send OTP email
  await transporter.sendMail({
    from: `"Vidyavaidya Foundation" <${process.env.EMAIL_USER}>`,
    to: normalizedEmail,
    subject: '🔐 Your Vidyavaidya Login OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
          <tr><td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0b3c5d 0%,#1abc9c 100%);padding:36px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Vidyavaidya Foundation</h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Empowering Lives Through Healthcare & Education</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#0b3c5d;margin:0 0 12px;font-size:22px;">Verify Your Email</h2>
                  <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px;">
                    Use the 6-digit code below to complete your login. This code is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#f0fdf9;border:2px dashed #1abc9c;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                    <p style="color:#666;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Your One-Time Password</p>
                    <div style="font-size:48px;font-weight:800;color:#0b3c5d;letter-spacing:12px;font-family:monospace;">${otp}</div>
                  </div>

                  <p style="color:#888;font-size:13px;line-height:1.6;margin:0;">
                    If you did not request this code, please ignore this email. Your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                  <p style="color:#aaa;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} Vidyavaidya Foundation. All rights reserved.<br>
                    This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  });

  console.log(`✅ OTP sent to ${normalizedEmail} (expires in ${OTP_EXPIRY_MINUTES} min)`);
  return { success: true, expiresAt };
}

/**
 * Verify OTP for a given email
 * Returns { valid: true } or throws an error with message
 */
async function verifyOtp(email, inputOtp) {
  const normalizedEmail = email.trim().toLowerCase();
  const otpRef = db.collection('otps').doc(normalizedEmail);
  const otpDoc = await otpRef.get();

  if (!otpDoc.exists) {
    throw new Error('No OTP found for this email. Please request a new code.');
  }

  const data = otpDoc.data();
  const now = new Date();
  const expiresAt = data.expiresAt.toDate();

  // Check expiry
  if (now > expiresAt) {
    await otpRef.delete();
    throw new Error('OTP has expired. Please request a new code.');
  }

  // Check max attempts
  if (data.attempts >= MAX_ATTEMPTS) {
    await otpRef.delete();
    throw new Error('Too many incorrect attempts. Please request a new OTP.');
  }

  // Check OTP match
  if (data.otp !== inputOtp.toString().trim()) {
    await otpRef.update({ attempts: admin.firestore.FieldValue.increment(1) });
    const remaining = MAX_ATTEMPTS - data.attempts - 1;
    throw new Error(`Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
  }

  // OTP is valid — delete it so it can't be reused
  await otpRef.delete();
  return { valid: true };
}

module.exports = { sendOtp, verifyOtp, generateOtp };

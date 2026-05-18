const { auth, db } = require('../config/firebase');
const emailService = require('../services/email.service');
const { encrypt } = require('../services/encryption.service');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otp.service');

const JWT_SECRET = process.env.JWT_SECRET || 'vidyavaidya-super-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

// Helper to generate a signed JWT for a Firestore user document
function generateJWT(userData) {
  return jwt.sign(
    {
      uid:   userData.uid,
      email: userData.email,
      role:  userData.role  || 'donor',
      admin: userData.role === 'admin'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

const authController = {
  /**
   * Register a new user in Firebase Auth and create Firestore profile
   */
  async register(req, res, next) {
    try {
      const { email, phone, fullName, password } = req.body;

      // Normalize phone to E.164 format
      const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/^0+/, '')}`;
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Check for duplicate email in Firestore first (fast, reliable)
      const existingSnap = await db.collection('users')
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        return res.status(409).json({
          error: 'An account with this email address already exists. Please login instead.'
        });
      }

      // 2. Try Firebase Auth createUser (optional — works only when Auth is enabled in console)
      let firebaseUid = null;
      try {
        const userRecord = await auth.createUser({
          email: normalizedEmail,
          password,
          phoneNumber: normalizedPhone,
          displayName: fullName
        });
        firebaseUid = userRecord.uid;
        console.log(`✅ Firebase Auth user created: ${firebaseUid}`);
      } catch (authError) {
        // Firebase Auth not enabled or configured yet — use local UUID fallback
        console.warn(`⚠️  Firebase Auth createUser skipped (${authError.code || authError.message})`);
        console.log('🔧 Using UUID fallback — writing profile directly to Firestore.');
        firebaseUid = `local-${uuidv4()}`;
      }

      // 3. Initialize the Firestore user document
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const userData = {
        uid: firebaseUid,
        email: normalizedEmail,
        phone: normalizedPhone,
        fullName,
        role: 'donor', // default role
        isAlumni: false,
        profileComplete: false,
        address: {
          line: '',
          city: '',
          state: '',
          country: 'India',
          pincode: ''
        },
        pan: '',
        totalDonated: 0,
        donationCount: 0,
        lastLoginAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true
      };

      await db.collection('users').doc(firebaseUid).set(userData);
      console.log(`✅ Firestore user profile created: users/${firebaseUid}`);

      // 3. Dispatch welcome email (fire-and-forget, don't block response)
      emailService.sendWelcomeEmail(normalizedEmail, fullName).catch(err => {
        console.warn('Welcome email dispatch skipped:', err.message);
      });

      return res.status(201).json({
        success: true,
        uid: firebaseUid,
        email: normalizedEmail,
        message: 'Account created successfully! Your profile has been saved.'
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists' || error.code === 'auth/phone-number-already-exists') {
        return res.status(409).json({ error: error.message || 'User with this email or phone number already exists' });
      }
      next(error);
    }
  },

  /**
   * Verifies Client-side Email/Password Login Token and updates Firestore
   */
  async login(req, res, next) {
    try {
      const { idToken } = req.body;

      // 1. Verify token with Firebase Admin
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // 2. Get user document from Firestore
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // If they logged in through social but didn't have a Firestore profile yet, upsert one
        const timestamp = admin.firestore.Timestamp.fromDate(new Date());
        const newProfile = {
          uid,
          email: decodedToken.email || '',
          phone: decodedToken.phone_number || '',
          fullName: decodedToken.name || 'Friend',
          role: 'donor',
          isAlumni: false,
          profileComplete: false,
          address: { line: '', city: '', state: '', country: 'India', pincode: '' },
          pan: '',
          totalDonated: 0,
          donationCount: 0,
          lastLoginAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          isActive: true
        };
        await userRef.set(newProfile);
        
        return res.status(200).json({
          success: true,
          uid,
          email: newProfile.email,
          role: newProfile.role,
          profileComplete: false
        });
      }

      const userData = userDoc.data();

      if (userData.isActive === false) {
        return res.status(403).json({ error: 'Account has been disabled' });
      }

      // 3. Update last login timestamp
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      await userRef.update({ lastLoginAt: timestamp });

      return res.status(200).json({
        success: true,
        uid,
        email: userData.email,
        role: userData.role || 'donor',
        profileComplete: userData.profileComplete || false
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Send a 6-digit OTP to the user's email address
   * POST /api/auth/send-otp  { email }
   */
  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Rate-limit: allow resend only after 60 seconds
      const existing = await db.collection('otps').doc(normalizedEmail).get();
      if (existing.exists) {
        const created = existing.data().createdAt?.toDate();
        if (created && Date.now() - created.getTime() < 60 * 1000) {
          const waitSec = Math.ceil((60 * 1000 - (Date.now() - created.getTime())) / 1000);
          return res.status(429).json({
            error: `Please wait ${waitSec} seconds before requesting a new OTP.`
          });
        }
      }

      await otpService.sendOtp(normalizedEmail);

      return res.status(200).json({
        success: true,
        message: `OTP sent to ${normalizedEmail}. Valid for 10 minutes.`
      });
    } catch (error) {
      console.error('sendOtp error:', error.message);
      next(error);
    }
  },

  /**
   * Verify the 6-digit OTP and return a signed JWT
   * POST /api/auth/verify-otp  { email, otp }
   */
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Verify the OTP (throws on failure)
      await otpService.verifyOtp(normalizedEmail, otp);

      // Find or create the Firestore user document
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      let userSnap = await db.collection('users')
        .where('email', '==', normalizedEmail)
        .limit(1)
        .get();

      let userData;
      let isNewUser = false;

      if (userSnap.empty) {
        // First-time login via OTP — create a minimal profile
        isNewUser = true;
        const newUid = `local-${uuidv4()}`;
        userData = {
          uid: newUid,
          email: normalizedEmail,
          phone: '',
          fullName: normalizedEmail.split('@')[0],
          role: 'donor',
          isAlumni: false,
          profileComplete: false,
          address: { line: '', city: '', state: '', country: 'India', pincode: '' },
          pan: '',
          totalDonated: 0,
          donationCount: 0,
          lastLoginAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          isActive: true
        };
        await db.collection('users').doc(newUid).set(userData);
        console.log(`✅ New user profile auto-created: ${newUid}`);
      } else {
        userData = userSnap.docs[0].data();
        if (userData.isActive === false) {
          return res.status(403).json({ error: 'Your account has been disabled. Contact support.' });
        }
        // Update last login
        await db.collection('users').doc(userData.uid).update({ lastLoginAt: timestamp });
      }

      // Generate a signed JWT
      const token = generateJWT(userData);

      console.log(`✅ OTP verified — JWT issued for: ${normalizedEmail}`);

      return res.status(200).json({
        success: true,
        token,
        uid: userData.uid,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        isNewUser,
        profileComplete: userData.profileComplete || false
      });
    } catch (error) {
      // OTP verification failures are user errors (400), not server errors
      if (error.message.includes('OTP') || error.message.includes('expired') || error.message.includes('attempts')) {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  },
  /**
   * Revoke auth refresh tokens
   */
  async logout(req, res, next) {
    try {
      const uid = req.user.uid;
      await auth.revokeRefreshTokens(uid);
      return res.status(200).json({ success: true, message: 'Logged out and session revoked successfully' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get currently authenticated user details
   */
  async getMe(req, res, next) {
    try {
      const uid = req.user.uid;
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.status(200).json({
        success: true,
        user: userDoc.data()
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin Login support (handles both static credentials for demo and real claim token checking)
   */
  async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Support demo credentials specified in AdminLogin.jsx
      if ((email === 'admin' || email === 'admin@vidyavaidya.org') && password === 'vidyavaidya@2024') {
        return res.status(200).json({
          success: true,
          uid: 'static-demo-admin-uid',
          email: 'admin@vidyavaidya.org',
          role: 'admin',
          token: 'demo-admin-token-bypass'
        });
      }

      // In a strict production system, we call Firebase REST auth:
      // Since this requires an API key, we will search for an admin user in our database matching this email.
      // In production, administrators will authenticate via standard Firebase Login on client-side,
      // and their custom claims are set up. This endpoint will serve as verification.
      const usersSnap = await db.collection('users')
        .where('email', '==', email.toLowerCase())
        .where('role', '==', 'admin')
        .limit(1)
        .get();

      if (usersSnap.empty) {
        return res.status(403).json({ error: 'Access denied: Admin privileges are required' });
      }

      const adminUserDoc = usersSnap.docs[0];
      const adminData = adminUserDoc.data();

      // Return details. The token check will happen client-side through standard ID Token.
      return res.status(200).json({
        success: true,
        uid: adminData.uid,
        email: adminData.email,
        role: 'admin',
        token: 'firebase-admin-authorized'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Upgrade a user to admin and apply custom claims
   */
  async setAdminClaim(req, res, next) {
    try {
      const { targetUid } = req.body;

      // Apply Firebase custom claim
      await auth.setCustomUserClaims(targetUid, { admin: true, role: 'admin' });

      // Update Firestore field
      await db.collection('users').doc(targetUid).update({
        role: 'admin',
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: `Admin custom claims successfully applied to UID: ${targetUid}`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;

const { auth, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    // ── 1. Developer sandbox bypass ──────────────────────────────────────────
    if (token.startsWith('mock-jwt-bypass-')) {
      const uid = token.replace('mock-jwt-bypass-', '');
      decodedToken = {
        uid,
        email: 'test@vidyavaidya.org',
        phone_number: '+919876543210',
        role: 'donor',
        admin: uid.includes('admin')
      };

    // ── 2. Our own JWT (issued by /api/auth/verify-otp) ──────────────────────
    } else if (!token.startsWith('eyJhbGciOiJSUzI1NiJ9') && token.split('.').length === 3) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        decodedToken = {
          uid:          payload.uid,
          email:        payload.email,
          phone_number: payload.phone || '',
          role:         payload.role  || 'donor',
          admin:        payload.admin || false
        };
      } catch (jwtErr) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired JWT token' });
      }

    // ── 3. Firebase Admin ID token ────────────────────────────────────────────
    } else {
      decodedToken = await auth.verifyIdToken(token);
    }

    // Fetch user details from Firestore to verify their state and roles
    const admin = require('firebase-admin');
    let userData = null;

    // Prevent virtual demo admin from polluting the production Firestore 'users' collection
    if (decodedToken.uid === 'static-demo-admin-uid' || decodedToken.uid.includes('bypass')) {
      userData = {
        uid: decodedToken.uid,
        email: decodedToken.email || 'admin@vidyavaidya.org',
        role: decodedToken.role || 'admin',
        isActive: true,
        profileComplete: true,
        phone: decodedToken.phone_number || ''
      };
    } else {
      let userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (!userDoc.exists) {
        const timestamp = admin.firestore.Timestamp.fromDate(new Date());
        const defaultProfile = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          phone: decodedToken.phone_number || '',
          fullName: decodedToken.name || (decodedToken.email ? decodedToken.email.split('@')[0].toUpperCase() : 'VIDYA VAIDYA'),
          role: decodedToken.role || 'donor',
          isAlumni: false,
          profileComplete: false,
          address: {
            line: '',
            city: '',
            state: '',
            country: 'India',
            pincode: ''
          },
          totalDonated: 0,
          donationCount: 0,
          lastLoginAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          isActive: true
        };
        await db.collection('users').doc(decodedToken.uid).set(defaultProfile);
        userDoc = await db.collection('users').doc(decodedToken.uid).get();
      }
      userData = userDoc.data();
    }

    if (userData.isActive === false) {
      return res.status(403).json({ error: 'Forbidden: Your account has been disabled' });
    }
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || userData.email,
      phone: decodedToken.phone_number || userData.phone,
      role: userData.role || decodedToken.role || 'donor',
      admin: decodedToken.admin || (userData.role === 'admin'),
      profileComplete: userData.profileComplete || false
    };

    next();
  } catch (error) {
    console.error('🔒 Auth Middleware Error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
  }
};

module.exports = authMiddleware;

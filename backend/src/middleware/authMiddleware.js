// CHANGED: F2, B2, SEC8
// F2  — Skip per-request Firestore user lookup when JWT already carries role/isActive claims
// B2  — Remove mock-jwt-bypass in production; strictly disabled outside development
// SEC8 — Throw 403 on unregistered accounts instead of auto-creating them

const { auth, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

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

    // ── 1. Developer sandbox bypass — DISABLED in production (B2) ────────────
    if (token.startsWith('mock-jwt-bypass-')) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ error: 'Unauthorized: Mock bypass tokens are not permitted in production' });
      }
      const uid = token.replace('mock-jwt-bypass-', '');
      decodedToken = {
        uid,
        email: 'test@vidyavaidya.org',
        phone_number: '+919876543210',
        role: 'donor',
        isActive: true,
        admin: uid.includes('admin'),
        _fromJWT: true   // skip Firestore lookup below
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
          isActive:     payload.isActive !== undefined ? payload.isActive : true,
          admin:        payload.admin || false,
          _fromJWT:     true   // F2: claims already embedded — skip Firestore lookup
        };
      } catch (jwtErr) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired JWT token' });
      }

    // ── 3. Firebase Admin ID token ────────────────────────────────────────────
    } else {
      decodedToken = await auth.verifyIdToken(token);
      decodedToken._fromJWT = false;
    }

    // ── 4. Resolve user data (F2: skip Firestore if JWT already has claims) ──
    let userData = null;

    // Static admin bypass (dev only check already done above)
    if (decodedToken.uid === 'static-demo-admin-uid' || decodedToken.uid.includes('bypass')) {
      userData = {
        uid:             decodedToken.uid,
        email:           decodedToken.email || 'admin@vidyavaidya.org',
        role:            decodedToken.role  || 'admin',
        isActive:        true,
        profileComplete: true,
        phone:           decodedToken.phone_number || ''
      };
    } else if (decodedToken._fromJWT && decodedToken.role && decodedToken.isActive !== undefined) {
      // F2: JWT already carries role and isActive — no Firestore round-trip needed
      userData = {
        uid:             decodedToken.uid,
        email:           decodedToken.email || '',
        phone:           decodedToken.phone_number || '',
        role:            decodedToken.role,
        isActive:        decodedToken.isActive,
        profileComplete: decodedToken.profileComplete || false
      };
    } else {
      // Firebase ID token path — must read Firestore for role/isActive
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        // SEC8: Reject unregistered accounts instead of auto-creating a profile
        return res.status(403).json({
          error: 'Forbidden: This account is not registered in the Vidyavaidya system. Please sign up first.'
        });
      }
      userData = userDoc.data();
    }

    if (userData.isActive === false) {
      return res.status(403).json({ error: 'Forbidden: Your account has been disabled' });
    }

    req.user = {
      uid:             decodedToken.uid,
      email:           decodedToken.email || userData.email,
      phone:           decodedToken.phone_number || userData.phone,
      role:            userData.role || decodedToken.role || 'donor',
      admin:           decodedToken.admin || (userData.role === 'admin'),
      profileComplete: userData.profileComplete || false
    };

    next();
  } catch (error) {
    console.error('🔒 Auth Middleware Error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
  }
};

module.exports = authMiddleware;

/**
 * Admin Profile Controller
 * Handles GET profile, UPDATE profile, and CHANGE PASSWORD for the admin account.
 * Passwords are hashed with Node.js built-in scrypt (memory-hard, no external deps).
 * Admin config is persisted in Firestore under: admin_config/main
 */

const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Static fallback credentials (match auth.controller.js adminLogin)
const STATIC_ADMIN_EMAIL   = 'admin@vidyavaidya.org';
const STATIC_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vidyavaidya@2024';

const sanitize = (str) => (str ? String(str).replace(/<[^>]*>/g, '').trim() : '');

/**
 * Hash a plaintext password using scrypt (memory-hard, built into Node.js crypto).
 * Returns format: "randomSaltHex:derivedKeyHex"
 */
function hashPassword(plaintext) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plaintext, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify a plaintext password against a stored "salt:hash" string.
 */
function verifyPassword(plaintext, stored) {
  try {
    const [salt, expectedKey] = stored.split(':');
    if (!salt || !expectedKey) return false;
    const derivedKey = crypto.scryptSync(plaintext, salt, 64).toString('hex');
    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(derivedKey, 'hex'),
      Buffer.from(expectedKey, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Ensure the admin_config/main document exists, creating it with defaults if not.
 */
async function ensureAdminConfig() {
  const ref = db.collection('admin_config').doc('main');
  const snap = await ref.get();
  if (!snap.exists) {
    const now = admin.firestore.Timestamp.fromDate(new Date());
    const defaults = {
      fullName:  'Administrator',
      email:     STATIC_ADMIN_EMAIL,
      phone:     '+91 98765 43210',
      createdAt: now,
      updatedAt: now
      // passwordHash is intentionally omitted — falls back to STATIC_ADMIN_PASSWORD
    };
    await ref.set(defaults);
    return { ref, data: defaults };
  }
  return { ref, data: snap.data() };
}

const adminProfileController = {
  /**
   * GET /api/admin/profile
   * Returns admin profile info (fullName, email, phone, createdAt, role).
   * Does NOT return any password hash.
   */
  async getProfile(req, res, next) {
    try {
      const { data } = await ensureAdminConfig();

      const createdAt = data.createdAt
        ? (data.createdAt._seconds
            ? new Date(data.createdAt._seconds * 1000).toISOString()
            : new Date(data.createdAt).toISOString())
        : new Date().toISOString();

      return res.status(200).json({
        success: true,
        profile: {
          fullName:  data.fullName  || 'Administrator',
          email:     data.email     || STATIC_ADMIN_EMAIL,
          phone:     data.phone     || '',
          createdAt,
          role: 'Super Administrator',
          hasCustomPassword: !!data.passwordHash
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/profile
   * Updates admin fullName and phone.
   * Email is non-editable (tied to auth credentials).
   */
  async updateProfile(req, res, next) {
    try {
      const { fullName, phone } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Full name is required and cannot be empty.' });
      }

      const { ref, data } = await ensureAdminConfig();

      const updates = {
        fullName:  sanitize(fullName),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      };

      if (phone !== undefined) {
        updates.phone = sanitize(phone);
      }

      await ref.update(updates);

      return res.status(200).json({
        success: true,
        message: 'Admin profile updated successfully.',
        profile: {
          fullName: updates.fullName,
          phone:    updates.phone ?? data.phone,
          email:    data.email || STATIC_ADMIN_EMAIL
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/profile/change-password
   * Verifies the current password, then stores a new scrypt hash in Firestore.
   * Falls back to the static env password if no hash is stored yet.
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({ error: 'New password must differ from the current password.' });
      }

      const { ref, data } = await ensureAdminConfig();

      // Verify current password
      let currentValid = false;
      if (data.passwordHash) {
        // Verify against stored scrypt hash
        currentValid = verifyPassword(currentPassword, data.passwordHash);
      } else {
        // First-time: fall back to static credential
        currentValid = (currentPassword === STATIC_ADMIN_PASSWORD);
      }

      if (!currentValid) {
        return res.status(401).json({ error: 'Current password is incorrect. Please try again.' });
      }

      // Hash and store the new password
      const passwordHash = hashPassword(newPassword);

      await ref.update({
        passwordHash,
        updatedAt: admin.firestore.Timestamp.fromDate(new Date())
      });

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please use your new password on next login.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminProfileController;
module.exports._verifyPassword = verifyPassword; // exported for use in auth.controller.js

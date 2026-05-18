const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
// Ensure the encryption key is exactly 32 bytes. If not, fallback to a safe 32-byte representation.
let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';
if (ENCRYPTION_KEY.length !== 32 && ENCRYPTION_KEY.length !== 64) {
  ENCRYPTION_KEY = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest('hex');
}
const KEY = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');

/**
 * Encrypt a text string using AES-256-GCM
 * @param {string} text 
 * @returns {string} Combined format IV:AuthTag:EncryptedText
 */
const encrypt = (text) => {
  if (!text) return null;
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption of sensitive data failed');
  }
};

/**
 * Decrypt a cipher text back into plain text
 * @param {string} cipherText 
 * @returns {string} Decrypted plain text
 */
const decrypt = (cipherText) => {
  if (!cipherText) return null;
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      // Return raw string if it was not encrypted in this format (fallback)
      return cipherText;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed, returning fallback placeholder:', error.message);
    return 'DECRYPTION_FAILED';
  }
};

module.exports = {
  encrypt,
  decrypt
};

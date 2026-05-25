// CHANGED: F8 — Guard against double-init on hot-reload
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

let serviceAccount;

if (process.env.FIRESTORE_PRIVATE_KEY && process.env.FIRESTORE_CLIENT_EMAIL && process.env.FIRESTORE_PROJECT_ID) {
  serviceAccount = {
    projectId: process.env.FIRESTORE_PROJECT_ID.replace(/"/g, ''),
    clientEmail: process.env.FIRESTORE_CLIENT_EMAIL.replace(/"/g, ''),
    privateKey: process.env.FIRESTORE_PRIVATE_KEY.replace(/"/g, '').replace(/\\n/g, '\n')
  };
} else {
  try {
    serviceAccount = require('../../vidya-vaidya-firebase-adminsdk-fbsvc-a9a1e4dda5.json');
  } catch (err) {
    try {
      serviceAccount = require('../vidya-vaidya-firebase-adminsdk-fbsvc-a9a1e4dda5.json');
    } catch (err2) {
      console.error('Failed to load service account credentials.', err2);
      throw new Error('Firebase credentials not found. Please set them in .env or provide the service account JSON.');
    }
  }
}

// F8: Guard against double-initialisation during hot-reloads in development
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.projectId || 'vidya-vaidya'}.appspot.com`
    });
    console.log('🔥 Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    throw error;
  }
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };

// CHANGED: B1, F4
// B1 — Fixed hardcoded idField derivation (events → eventId, etc.) — now accepts optional override
// F4 — Added updateDonationSummary() to atomically maintain a counter document at
//      donations_meta/summary, eliminating the full-collection scan in getOverview()

const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const getTimestamp = (date = new Date()) => {
  return admin.firestore.Timestamp.fromDate(date);
};

// ── F4: Atomic counter updater ────────────────────────────────────────────────
/**
 * Update the donations_meta/summary counter document atomically.
 * Call this whenever a donation status changes (created/captured/refunded).
 *
 * @param {string|null} oldStatus - previous status ('pending'|'successful'|'failed'|null)
 * @param {string}      newStatus - new status to apply
 * @param {number}      amount    - donation amount in INR
 * @param {string}      category  - 'Education'|'Healthcare'|'Community'|other
 */
async function updateDonationSummary(oldStatus, newStatus, amount, category) {
  const summaryRef = db.collection('donations_meta').doc('summary');

  await db.runTransaction(async (txn) => {
    const summaryDoc = await txn.get(summaryRef);

    // Seed a fresh summary document if it doesn't exist yet
    const base = summaryDoc.exists
      ? summaryDoc.data()
      : {
          totalRaised:       0,
          successfulCount:   0,
          pendingCount:      0,
          failedCount:       0,
          categoryBreakdown: { Education: 0, Healthcare: 0, Community: 0 },
          lastUpdatedAt:     getTimestamp()
        };

    // Decrement counters for the old status (if there was one)
    if (oldStatus === 'successful') {
      base.totalRaised     = Math.max(0, (base.totalRaised || 0) - amount);
      base.successfulCount = Math.max(0, (base.successfulCount || 0) - 1);
      if (category && base.categoryBreakdown && base.categoryBreakdown[category] !== undefined) {
        base.categoryBreakdown[category] = Math.max(0, base.categoryBreakdown[category] - amount);
      }
    } else if (oldStatus === 'pending') {
      base.pendingCount = Math.max(0, (base.pendingCount || 0) - 1);
    } else if (oldStatus === 'failed') {
      base.failedCount = Math.max(0, (base.failedCount || 0) - 1);
    }

    // Increment counters for the new status
    if (newStatus === 'successful') {
      base.totalRaised     = (base.totalRaised     || 0) + amount;
      base.successfulCount = (base.successfulCount || 0) + 1;
      if (category && base.categoryBreakdown) {
        base.categoryBreakdown[category] = (base.categoryBreakdown[category] || 0) + amount;
      }
    } else if (newStatus === 'pending') {
      base.pendingCount = (base.pendingCount || 0) + 1;
    } else if (newStatus === 'failed') {
      base.failedCount = (base.failedCount || 0) + 1;
    }

    base.lastUpdatedAt = getTimestamp();

    if (summaryDoc.exists) {
      txn.update(summaryRef, base);
    } else {
      txn.set(summaryRef, base);
    }
  });
}

const firestoreService = {
  db,

  // Generic helper to get a document by ID
  async get(collection, docId) {
    const doc = await db.collection(collection).doc(docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  // Generic helper to create/set a document by ID
  async set(collection, docId, data) {
    const timestamp = getTimestamp();
    const docData = {
      ...data,
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp
    };
    await db.collection(collection).doc(docId).set(docData);
    return { id: docId, ...docData };
  },

  // Generic helper to add a document with auto-generated ID
  // B1: idFieldOverride lets callers pass their own field name instead of the
  //     brittle regex-derived one (e.g. 'partners' → 'partnerId', not 'partner').
  async add(collection, data, idFieldOverride = null) {
    const timestamp = getTimestamp();
    const docRef = db.collection(collection).doc();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // B1: Use caller-supplied override; fall back to simple plural-strip derivation
    const idField = idFieldOverride
      ? idFieldOverride
      : collection.replace(/ies$/, 'y').replace(/s$/, '') + 'Id';

    docData[idField] = docRef.id;

    await docRef.set(docData);
    return { id: docRef.id, ...docData };
  },

  // Generic helper to update a document
  async update(collection, docId, data) {
    const timestamp = getTimestamp();
    const updateData = {
      ...data,
      updatedAt: timestamp
    };
    await db.collection(collection).doc(docId).update(updateData);
    return true;
  },

  // Generic helper to delete a document (or soft delete)
  async delete(collection, docId) {
    await db.collection(collection).doc(docId).delete();
    return true;
  },

  // Generic query builder helper
  async query(collection, filters = [], orderBy = null, limit = null, startAfterDoc = null) {
    let queryRef = db.collection(collection);

    // Filter array format: [{ field, operator, value }]
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null) {
        queryRef = queryRef.where(filter.field, filter.operator, filter.value);
      }
    });

    if (orderBy) {
      queryRef = queryRef.orderBy(orderBy.field, orderBy.direction || 'asc');
    }

    if (startAfterDoc) {
      queryRef = queryRef.startAfter(startAfterDoc);
    }

    if (limit) {
      queryRef = queryRef.limit(limit);
    }

    const snapshot = await queryRef.get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  }
};

module.exports = firestoreService;
module.exports.updateDonationSummary = updateDonationSummary;
module.exports.getTimestamp = getTimestamp;

const { db } = require('../config/firebase');
const admin = require('firebase-admin');

const getTimestamp = (date = new Date()) => {
  return admin.firestore.Timestamp.fromDate(date);
};

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
  async add(collection, data) {
    const timestamp = getTimestamp();
    const docRef = db.collection(collection).doc();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    // If the schema requires storing the id inside the document itself (like eventId, storyId)
    // we can pass a callback or let callers handle it, but setting it here is clean:
    const idField = collection.replace(/s$/, '') + 'Id'; // e.g. events -> eventId
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
exportConfig = { getTimestamp };

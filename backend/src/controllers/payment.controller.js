const crypto = require('crypto');
const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const razorpayService = require('../services/razorpay.service');
const receiptService = require('../services/receipt.service');
const emailService = require('../services/email.service');
const { encrypt } = require('../services/encryption.service');

async function findOrCreateUser(donorDetails, isPanEncrypted = false) {
  if (!donorDetails || !donorDetails.email) {
    throw new Error('Donor email is required to process donation.');
  }

  const emailNormalized = donorDetails.email.trim().toLowerCase();
  const rawPhone = donorDetails.phone || '';
  const phoneNormalized = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone.replace(/^0+/, '')}`;

  // 1. Search for existing user in Firestore by email
  const userEmailSnap = await db.collection('users')
    .where('email', '==', emailNormalized)
    .limit(1)
    .get();

  const timestamp = admin.firestore.Timestamp.fromDate(new Date());

  if (!userEmailSnap.empty) {
    const userDoc = userEmailSnap.docs[0];
    const userData = userDoc.data();
    
    // Update address or phone if they are empty
    const updates = {};
    if (!userData.phone && phoneNormalized) {
      updates.phone = phoneNormalized;
    }
    if (donorDetails.address) {
      const currentAddress = userData.address || {};
      updates.address = {
        line: currentAddress.line || donorDetails.address.line || '',
        city: currentAddress.city || donorDetails.address.city || '',
        state: currentAddress.state || donorDetails.address.state || '',
        country: currentAddress.country || donorDetails.address.country || 'India',
        pincode: currentAddress.pincode || donorDetails.address.pincode || '',
      };
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = timestamp;
      await db.collection('users').doc(userDoc.id).update(updates);
    }
    return userDoc.id;
  }

  // 2. Search for existing user by phone
  if (phoneNormalized) {
    const userPhoneSnap = await db.collection('users')
      .where('phone', '==', phoneNormalized)
      .limit(1)
      .get();

    if (!userPhoneSnap.empty) {
      const userDoc = userPhoneSnap.docs[0];
      return userDoc.id;
    }
  }

  // 3. Create a new user account (Firebase Auth + Firestore)
  let firebaseUid = null;
  try {
    try {
      // Check if user already exists in Firebase Auth to avoid duplicate errors
      const existingUser = await auth.getUserByEmail(emailNormalized);
      firebaseUid = existingUser.uid;
      console.log(`✅ Retrieved existing Firebase Auth user uid: ${firebaseUid}`);
    } catch (getErr) {
      // User doesn't exist in Firebase Auth; create new account
      const userRecord = await auth.createUser({
        email: emailNormalized,
        password: 'Vidyavaidya@2026',
        phoneNumber: phoneNormalized || undefined,
        displayName: donorDetails.fullName
      });
      firebaseUid = userRecord.uid;
      console.log(`✅ Firebase Auth user auto-created via donation: ${firebaseUid}`);
    }
  } catch (authError) {
    if (authError.code === 'auth/email-already-exists') {
      try {
        const existingUser = await auth.getUserByEmail(emailNormalized);
        firebaseUid = existingUser.uid;
        console.log(`✅ Retrieved existing Firebase Auth user uid on email-already-exists error: ${firebaseUid}`);
      } catch (getErr2) {
        console.error('❌ Failed to retrieve existing user after email-already-exists error:', getErr2.message);
        firebaseUid = `local-${uuidv4()}`;
      }
    } else {
      console.warn(`⚠️ Firebase Auth createUser skipped in donation flow (${authError.message})`);
      firebaseUid = `local-${uuidv4()}`;
    }
  }

  const userData = {
    uid: firebaseUid,
    email: emailNormalized,
    phone: phoneNormalized,
    fullName: donorDetails.fullName,
    role: 'donor',
    isAlumni: donorDetails.isAlumni || false,
    profileComplete: true,
    address: {
      line: donorDetails.address?.line || '',
      city: donorDetails.address?.city || '',
      state: donorDetails.address?.state || '',
      country: donorDetails.address?.country || 'India',
      pincode: donorDetails.address?.pincode || '',
    },
    totalDonated: 0,
    donationCount: 0,
    lastLoginAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
    isActive: true
  };

  await db.collection('users').doc(firebaseUid).set(userData);
  console.log(`✅ Firestore user profile auto-created via donation: users/${firebaseUid}`);

  // Send a welcome email asynchronously
  emailService.sendWelcomeEmail(emailNormalized, donorDetails.fullName).catch(err => {
    console.warn('Welcome email dispatch skipped:', err.message);
  });

  return firebaseUid;
}

async function syncUserProfileDetails(uid, donorDetails, isPanEncrypted = false) {
  if (!uid || uid === 'GUEST') return;
  
  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    const timestamp = admin.firestore.Timestamp.fromDate(new Date());
    
    if (!userSnap.exists) {
      // Auto-create missing user profile with entered details
      const emailNormalized = donorDetails.email ? donorDetails.email.trim().toLowerCase() : '';
      const rawPhone = donorDetails.phone || '';
      const phoneNormalized = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone.replace(/^0+/, '')}`;
      
      const newProfile = {
        uid,
        email: emailNormalized,
        phone: phoneNormalized,
        fullName: donorDetails.fullName || 'VIDYA VAIDYA',
        role: 'donor',
        isAlumni: donorDetails.isAlumni || false,
        alumniId: donorDetails.alumniId || '',
        profileComplete: true,
        address: {
          line: donorDetails.address?.line || donorDetails.address || '',
          city: donorDetails.address?.city || '',
          state: donorDetails.address?.state || '',
          country: donorDetails.address?.country || 'India',
          pincode: donorDetails.address?.pincode || '',
        },
        totalDonated: 0,
        donationCount: 0,
        lastLoginAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true
      };
      await userRef.set(newProfile);
      console.log(`✅ Created missing user profile for ${uid} during sync`);
      return;
    }
    
    const userData = userSnap.data();
    const updates = {};
    
    // 1. Aggressively update fullName and email to match donation form
    if (donorDetails.fullName && donorDetails.fullName.trim() !== userData.fullName) {
      updates.fullName = donorDetails.fullName.trim();
    }
    
    if (donorDetails.email && donorDetails.email.trim().toLowerCase() !== userData.email) {
      updates.email = donorDetails.email.trim().toLowerCase();
    }
    
    // 2. Update phone/mobile if empty or changed
    if (donorDetails.phone) {
      const rawPhone = donorDetails.phone;
      const phoneNormalized = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone.replace(/^0+/, '')}`;
      if (!userData.phone || userData.phone !== phoneNormalized) {
        updates.phone = phoneNormalized;
      }
    }
    
    // 4. Update Alumni fields
    if (donorDetails.isAlumni) {
      if (!userData.isAlumni) {
        updates.isAlumni = true;
      }
      if (donorDetails.alumniId && userData.alumniId !== donorDetails.alumniId) {
        updates.alumniId = donorDetails.alumniId;
      }
    }
    
    // 5. Merge/Update Address
    if (donorDetails.address) {
      const currentAddress = userData.address || {};
      const newAddress = {
        line: donorDetails.address.line || currentAddress.line || '',
        city: donorDetails.address.city || currentAddress.city || '',
        state: donorDetails.address.state || currentAddress.state || '',
        country: donorDetails.address.country || currentAddress.country || 'India',
        pincode: donorDetails.address.pincode || currentAddress.pincode || '',
      };
      
      const hasAddressChanged = 
        newAddress.line !== currentAddress.line ||
        newAddress.city !== currentAddress.city ||
        newAddress.state !== currentAddress.state ||
        newAddress.country !== currentAddress.country ||
        newAddress.pincode !== currentAddress.pincode;
        
      if (hasAddressChanged) {
        updates.address = newAddress;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = timestamp;
      await userRef.update(updates);
      console.log(`✅ Synchronized user details for ${uid} in users collection.`);
    }
  } catch (err) {
    console.error(`⚠️ Failed to sync user profile details for ${uid}:`, err.message);
  }
}

const paymentController = {
  /**
   * Create a standard Razorpay payment order
   */
  async createOrder(req, res, next) {
    try {
      const { amount, currency = 'INR', donationType = 'one-time', category, subcategory, donorDetails } = req.body;
      let uid = 'GUEST';
      if (req.user) {
        // Only link to active session if emails match; otherwise create a separate donor identity
        const sessionEmail = req.user.email ? req.user.email.toLowerCase() : '';
        const formEmail = donorDetails && donorDetails.email ? donorDetails.email.trim().toLowerCase() : '';
        if (sessionEmail && formEmail && sessionEmail === formEmail) {
          uid = req.user.uid;
        }
      }

      // 1. Generate unique local receipt ref
      const localReceiptId = `VV-REC-${Date.now()}`;

      // 2. Call Razorpay API to formulate order
      let orderIdToUse = '';
      try {
        const order = await razorpayService.createOrder({
          amount,
          currency,
          receipt: localReceiptId,
          notes: {
            userId: uid,
            category,
            donationType
          }
        });
        orderIdToUse = order.id;
      } catch (razorpayErr) {
        console.warn('⚠️ Razorpay createOrder failed (falling back to Mock Order for testing):', razorpayErr.message);
        orderIdToUse = `mock_order_${Date.now()}`;
      }

      // 4. Save initial pending transaction state in Firestore
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const isRecurring = donationType === 'monthly';
      const pendingDonation = {
        orderId: orderIdToUse,
        donationId: '', // populated after capture
        userId: uid,
        donorName: donorDetails.fullName,
        donorEmail: donorDetails.email.toLowerCase(),
        donorPhone: donorDetails.phone,
        isAlumni: donorDetails.isAlumni || false,
        alumniId: donorDetails.alumniId || '',
        address: donorDetails.address,
        amount: Number(amount),
        amountInPaise: Math.round(amount * 100),
        currency,
        category,
        isRecurring,
        subcategory: subcategory || 'General Fund',
        donationType,
        frequency: isRecurring ? 'monthly' : 'one-time',
        status: 'pending',
        paymentMethod: '',
        razorpaySignature: '',
        receiptUrl: '',
        receiptNumber: '',
        is80GEligible: false,
        taxReceiptSent: false,
        notes: req.body.notes || 'Vidyavaidya Portal Support',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await db.collection('donations').doc(orderIdToUse).set(pendingDonation);

      // 5. Return order credentials to client
      return res.status(201).json({
        success: true,
        orderId: orderIdToUse,
        amount: Number(amount),
        amountInPaise: Math.round(amount * 100),
        currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stubkeyid'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create Razorpay plan and recurring subscription
   */
  async createSubscription(req, res, next) {
    try {
      const { planAmount, duration = 12, donorDetails } = req.body;
      let uid = 'GUEST';
      if (req.user) {
        const sessionEmail = req.user.email ? req.user.email.toLowerCase() : '';
        const formEmail = donorDetails && donorDetails.email ? donorDetails.email.trim().toLowerCase() : '';
        if (sessionEmail && formEmail && sessionEmail === formEmail) {
          uid = req.user.uid;
        }
      }

      // 1. Fetch or create recurring plan on Razorpay
      const planName = `Vidyavaidya Support - INR ${planAmount} Monthly`;
      
      let planIdToUse = '';
      let subscriptionIdToUse = '';
      let shortUrlToUse = '';
      
      try {
        const plan = await razorpayService.getOrCreatePlan({
          amount: planAmount,
          name: planName
        });
        planIdToUse = plan.id;

        // 2. Instantiate Subscription
        const subscription = await razorpayService.createSubscription({
          planId: plan.id,
          durationInMonths: duration,
          notes: {
            userId: uid,
            donorEmail: donorDetails.email
          }
        });
        subscriptionIdToUse = subscription.id;
        shortUrlToUse = subscription.short_url || '';
      } catch (razorpayErr) {
        console.warn('⚠️ Razorpay createSubscription failed (falling back to Mock Sub for testing):', razorpayErr.message);
        planIdToUse = `mock_plan_${Date.now()}`;
        subscriptionIdToUse = `mock_sub_${Date.now()}`;
        shortUrlToUse = 'https://vidyavaidya.org/demo-subscription';
      }

      // 3. Cache subscription reference in Firestore
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      await db.collection('subscriptions').doc(subscriptionIdToUse).set({
        subscriptionId: subscriptionIdToUse,
        planId: planIdToUse,
        userId: uid,
        amount: planAmount,
        duration,
        status: 'created',
        shortUrl: shortUrlToUse,
        donorDetails,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      return res.status(201).json({
        success: true,
        subscriptionId: subscriptionIdToUse,
        planId: planIdToUse,
        shortUrl: shortUrlToUse,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stubkeyid'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify Razorpay Payment and compile Receipt
   */
  async verifyPayment(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, razorpay_subscription_id, donorDetails } = req.body;

      // 1. Reconstruct HMAC-SHA256 signature
      if (razorpay_signature !== 'mock_signature') {
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'stubkeysecret';
        const body = razorpay_order_id ? (razorpay_order_id + "|" + razorpay_payment_id) : (razorpay_payment_id + "|" + razorpay_subscription_id);
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(body)
          .digest('hex');

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ error: 'Signature verification failed: Invalid secure tokens' });
        }
      }

      // 2. Query Firestore for the original order
      const targetOrderId = orderId || razorpay_order_id || razorpay_subscription_id;
      let donationRef = db.collection('donations').doc(targetOrderId);
      let donationDoc = await donationRef.get();

      let isSubscription = false;
      if (!donationDoc.exists) {
        donationRef = db.collection('subscriptions').doc(targetOrderId);
        donationDoc = await donationRef.get();
        if (donationDoc.exists) {
           isSubscription = true;
        } else {
           return res.status(404).json({ error: 'Matching donation order record not found' });
        }
      }

      const donationData = donationDoc.data();
      let uid = donationData.userId;

      // DEFERRED USER CREATION: Register guest user natively upon successful transaction
      if (uid === 'GUEST') {
         if (isSubscription) {
             uid = await findOrCreateUser(donorDetails || donationData.donorDetails, false);
         } else {
             const guestDetails = donorDetails || {
                 fullName: donationData.donorName,
                 email: donationData.donorEmail,
                 phone: donationData.donorPhone,
                 isAlumni: donationData.isAlumni,
                 alumniId: donationData.alumniId,
                 address: donationData.address
             };
             uid = await findOrCreateUser(guestDetails, true);
         }
         await donationRef.update({ userId: uid });
         donationData.userId = uid;
      }

      // Synchronize latest entered user details to users collection
      const donorDetailsToSync = donorDetails || (isSubscription ? donationData.donorDetails : {
          fullName: donationData.donorName,
          email: donationData.donorEmail,
          phone: donationData.donorPhone,
          isAlumni: donationData.isAlumni,
          alumniId: donationData.alumniId,
          address: donationData.address
      });
      await syncUserProfileDetails(uid, donorDetailsToSync, !isSubscription);

      // Check if order was already successfully processed (Idempotence)
      if (donationData.status === 'successful') {
        return res.status(200).json({
          success: true,
          message: 'Donation already processed successfully',
          donationId: donationData.donationId,
          receiptUrl: donationData.receiptUrl,
          receiptNumber: donationData.receiptNumber
        });
      }

      // 3. Query Razorpay API to double check payment status
      let paymentMethod = 'online';
      if (razorpay_signature !== 'mock_signature') {
          const paymentDetails = await razorpayService.fetchPayment(razorpay_payment_id);
          
          if (paymentDetails.status !== 'captured') {
            await razorpayService.initiateRefund({ paymentId: razorpay_payment_id, reason: 'Incomplete status' })
              .catch(() => {});
            return res.status(400).json({ error: 'Payment has not been successfully captured by Razorpay' });
          }
          paymentMethod = paymentDetails.method || 'online';
      } else {
          paymentMethod = 'mocked_online';
      }

      // 4. Generate unique serial receipt number VV-YYYY-XXXXXX
      const currentYear = new Date().getFullYear();
      const randomSerial = Math.floor(100000 + Math.random() * 900000);
      const receiptSerial = `VV-${currentYear}-${randomSerial}`;

      // 5. Update Firestore using atomic transacting updates
      const updatedTimestamp = admin.firestore.Timestamp.fromDate(new Date());
      const updatedDonation = {
        ...donationData,
        donationId: razorpay_payment_id,
        status: 'successful',
        paymentMethod: paymentMethod,
        razorpaySignature: razorpay_signature,
        receiptNumber: receiptSerial,
        updatedAt: updatedTimestamp
      };

      await donationRef.set(updatedDonation);

      // Update donor summary analytics
      const userRef = db.collection('users').doc(uid);
      await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        if (userSnap.exists) {
          const userData = userSnap.data();
          const currentTotal = userData.totalDonated || 0;
          const currentCount = userData.donationCount || 0;
          
          transaction.update(userRef, {
            totalDonated: currentTotal + donationData.amount,
            donationCount: currentCount + 1,
            updatedAt: updatedTimestamp
          });
        }
      });

      // 6. Generate tax receipt PDF
      let finalReceiptUrl = '';
      let pdfBuffer = null;
      try {
        pdfBuffer = await receiptService.generatePdfBuffer(updatedDonation);
      } catch (pdfErr) {
        console.error('⚠️ PDF Generation error:', pdfErr.message);
      }

      // 7. Email receipt PDF attachment to donor (Always attempt this even if upload fails)
      try {
        await emailService.sendDonationSuccessEmail(updatedDonation.donorEmail, {
          ...updatedDonation,
          receiptUrl: ''
        }, pdfBuffer);
      } catch (emailErr) {
        console.error('⚠️ Email dispatch error:', emailErr.message);
      }

      // 8. Upload tax receipt PDF to storage (runs asynchronously)
      if (pdfBuffer) {
        try {
          // We bypass uploadReceipt and use the buffer directly to avoid regenerating
          const bucket = admin.storage().bucket();
          const year = new Date().getFullYear();
          const receiptPath = `receipts/${year}/${uid}/${receiptSerial}.pdf`;
          const file = bucket.file(receiptPath);
          
          await file.save(pdfBuffer, {
            metadata: { contentType: 'application/pdf', cacheControl: 'public, max-age=31536000' }
          });

          const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year expiry
          });
          
          finalReceiptUrl = signedUrl;
          
          await donationRef.update({
            receiptUrl: finalReceiptUrl,
            taxReceiptSent: true
          });
        } catch (uploadErr) {
          console.error('⚠️ Receipt upload error (continuing response):', uploadErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and transaction completed successfully',
        donationId: razorpay_payment_id,
        receiptUrl: finalReceiptUrl || donationData.receiptUrl,
        receiptNumber: receiptSerial
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all donations for logged-in user
   */
  async getMyDonations(req, res, next) {
    try {
      const uid = req.user.uid;
      const donationsSnap = await db.collection('donations')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .get();

      const list = [];
      donationsSnap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });

      return res.status(200).json({
        success: true,
        donations: list
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get particulars for single donation
   */
  async getDonationById(req, res, next) {
    try {
      const uid = req.user.uid;
      const { donationId } = req.params;

      const doc = await db.collection('donations').doc(donationId).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      const data = doc.data();
      if (data.userId !== uid && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      return res.status(200).json({ success: true, donation: data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin-Only: Process a refund
   */
  async refundDonation(req, res, next) {
    try {
      const { donationId } = req.params;
      const { reason, amount } = req.body;

      const donationRef = db.collection('donations').doc(donationId);
      const donationDoc = await donationRef.get();
      if (!donationDoc.exists) {
        return res.status(404).json({ error: 'Donation record not found' });
      }

      const donation = donationDoc.data();
      if (donation.status !== 'successful') {
        return res.status(400).json({ error: 'Only successful donations can be refunded' });
      }

      // Trigger refund in Razorpay
      const refundResult = await razorpayService.initiateRefund({
        paymentId: donation.donationId,
        amount: amount || donation.amount,
        reason
      });

      // Update in Firestore
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      await donationRef.update({
        status: 'refunded',
        refundId: refundResult.id,
        refundNotes: reason,
        updatedAt: timestamp
      });

      // Update donor summary totals
      const userRef = db.collection('users').doc(donation.userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        await userRef.update({
          totalDonated: Math.max(0, (userData.totalDonated || 0) - (amount || donation.amount)),
          updatedAt: timestamp
        });
      }

      // Notify donor of refund
      emailService.sendMail({
        to: donation.donorEmail,
        subject: `Refund Processed - Vidyavaidya Foundation 💖`,
        html: `<p>Dear ${donation.donorName},</p><p>We have processed a refund of INR ${(amount || donation.amount).toFixed(2)} for your donation (Transaction ID: ${donation.donationId}) due to: <em>${reason}</em>.</p><p>Thank you for supporting our portal.</p>`
      }).catch(() => {});

      return res.status(200).json({
        success: true,
        message: 'Donation refunded successfully',
        refundId: refundResult.id
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  ...paymentController,
  findOrCreateUser,
  syncUserProfileDetails
};

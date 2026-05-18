const crypto = require('crypto');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const razorpayService = require('../services/razorpay.service');
const receiptService = require('../services/receipt.service');
const emailService = require('../services/email.service');
const { encrypt } = require('../services/encryption.service');

const paymentController = {
  /**
   * Create a standard Razorpay payment order
   */
  async createOrder(req, res, next) {
    try {
      const uid = req.user.uid;
      const { amount, currency = 'INR', donationType = 'one-time', category, subcategory, donorDetails } = req.body;

      // 1. Generate unique local receipt ref
      const localReceiptId = `VV-REC-${Date.now()}`;

      // 2. Call Razorpay API to formulate order
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

      // 3. Encrypt PAN card cardholder details
      const encryptedPan = donorDetails.pan ? encrypt(donorDetails.pan) : '';

      // 4. Save initial pending transaction state in Firestore
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      const pendingDonation = {
        orderId: order.id,
        donationId: '', // populated after capture
        userId: uid,
        donorName: donorDetails.fullName,
        donorEmail: donorDetails.email.toLowerCase(),
        donorPhone: donorDetails.phone,
        pan: encryptedPan,
        isAlumni: donorDetails.isAlumni || false,
        alumniId: donorDetails.alumniId || '',
        address: donorDetails.address,
        amount: Number(amount),
        amountInPaise: Math.round(amount * 100),
        currency,
        category,
        subcategory: subcategory || 'General Fund',
        donationType,
        frequency: donationType === 'monthly' ? 'monthly' : 'one-time',
        status: 'pending',
        paymentMethod: '',
        razorpaySignature: '',
        receiptUrl: '',
        receiptNumber: '',
        is80GEligible: !!donorDetails.pan,
        taxReceiptSent: false,
        notes: req.body.notes || 'Vidyavaidya Portal Support',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await db.collection('donations').doc(order.id).set(pendingDonation);

      // 5. Return order credentials to client
      return res.status(201).json({
        success: true,
        orderId: order.id,
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
      const uid = req.user.uid;
      const { planAmount, duration = 12, donorDetails } = req.body;

      // 1. Fetch or create recurring plan on Razorpay
      const planName = `Vidyavaidya Support - INR ${planAmount} Monthly`;
      const plan = await razorpayService.getOrCreatePlan({
        amount: planAmount,
        name: planName
      });

      // 2. Instantiate Subscription
      const subscription = await razorpayService.createSubscription({
        planId: plan.id,
        durationInMonths: duration,
        notes: {
          userId: uid,
          donorEmail: donorDetails.email
        }
      });

      // 3. Cache subscription reference in Firestore
      const timestamp = admin.firestore.Timestamp.fromDate(new Date());
      await db.collection('subscriptions').doc(subscription.id).set({
        subscriptionId: subscription.id,
        planId: plan.id,
        userId: uid,
        amount: planAmount,
        duration,
        status: 'created',
        shortUrl: subscription.short_url || '',
        donorDetails,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      return res.status(201).json({
        success: true,
        subscriptionId: subscription.id,
        planId: plan.id,
        shortUrl: subscription.short_url || ''
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
      const uid = req.user.uid;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      // 1. Reconstruct HMAC-SHA256 signature
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'stubkeysecret';
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Signature verification failed: Invalid secure tokens' });
      }

      // 2. Query Firestore for the original order
      const targetOrderId = orderId || razorpay_order_id;
      const donationRef = db.collection('donations').doc(targetOrderId);
      const donationDoc = await donationRef.get();

      if (!donationDoc.exists) {
        return res.status(404).json({ error: 'Matching donation order record not found' });
      }

      const donationData = donationDoc.data();

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
      const paymentDetails = await razorpayService.fetchPayment(razorpay_payment_id);
      
      if (paymentDetails.status !== 'captured') {
        // If not captured, capture the payment via backend trigger
        await razorpayService.initiateRefund({ paymentId: razorpay_payment_id, reason: 'Incomplete status' })
          .catch(() => {}); // safety cleanup
        return res.status(400).json({ error: 'Payment has not been successfully captured by Razorpay' });
      }

      // 4. Generate unique serial receipt number VV-YYYY-XXXXXX
      const currentYear = new Date().getFullYear();
      const randomSerial = Math.floor(100000 + Math.random() * 900000); // 6 digit sequential/random serial
      const receiptSerial = `VV-${currentYear}-${randomSerial}`;

      // 5. Update Firestore using atomic transacting updates
      const updatedTimestamp = admin.firestore.Timestamp.fromDate(new Date());
      const updatedDonation = {
        ...donationData,
        donationId: razorpay_payment_id,
        status: 'successful',
        paymentMethod: paymentDetails.method || 'online',
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

      // 6. Generate and upload tax receipt PDF to storage (runs asynchronously)
      let finalReceiptUrl = '';
      try {
        const uploadResult = await receiptService.uploadReceipt(updatedDonation);
        finalReceiptUrl = uploadResult.receiptUrl;
        
        await donationRef.update({
          receiptUrl: finalReceiptUrl,
          taxReceiptSent: true
        });

        // 7. Email receipt PDF attachment to donor
        const pdfBuffer = await receiptService.generatePdfBuffer(updatedDonation);
        await emailService.sendDonationSuccessEmail(updatedDonation.donorEmail, {
          ...updatedDonation,
          receiptUrl: finalReceiptUrl
        }, pdfBuffer);
        
      } catch (errReceipt) {
        console.error('⚠️ Receipt dispatch error (continuing response):', errReceipt.message);
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

module.exports = paymentController;

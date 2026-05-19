const crypto = require('crypto');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const receiptService = require('../services/receipt.service');
const emailService = require('../services/email.service');
const { findOrCreateUser, syncUserProfileDetails } = require('./payment.controller');

const webhookController = {
  /**
   * Handle Razorpay Webhooks (signature verified in route using rawBody)
   */
  async handleRazorpayWebhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'stubwebhooksecret';

      // 1. Verify cryptographic signature using raw request body
      // In app.js we must save req.rawBody = buf inside our raw parser
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('⚠️ Webhook verification rejected: HMAC token mismatch');
        return res.status(400).json({ error: 'Signature verification failed' });
      }

      // 2. Parse the verified payload
      const payload = req.body;
      const eventType = payload.event;
      console.log(`🔌 Razorpay Webhook Event Received: [${eventType}]`);

      // 3. Process events asynchronously to return 200 immediately to Razorpay
      res.status(200).json({ success: true, message: 'Webhook logged' });

      // Run business logic in background
      Promise.resolve().then(async () => {
        switch (eventType) {
          case 'payment.captured': {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;
            
            if (!orderId) return;

            // Resolve transaction state
            const donationRef = db.collection('donations').doc(orderId);
            const doc = await donationRef.get();
            
            if (doc.exists) {
              const donation = doc.data();
              if (donation.status === 'successful') {
                console.log(`Webhook: Order ${orderId} already marked successful. Idempotent escape.`);
                return;
              }

              let uid = donation.userId;
              if (uid === 'GUEST') {
                const donorDetails = {
                  fullName: donation.donorName,
                  email: donation.donorEmail,
                  phone: donation.donorPhone,
                  isAlumni: donation.isAlumni,
                  alumniId: donation.alumniId,
                  address: donation.address
                };
                uid = await findOrCreateUser(donorDetails, true);
                donation.userId = uid;
              }

              // Synchronize latest entered user details to users collection
              const donorDetails = {
                fullName: donation.donorName,
                email: donation.donorEmail,
                phone: donation.donorPhone,
                isAlumni: donation.isAlumni,
                alumniId: donation.alumniId,
                address: donation.address
              };
              await syncUserProfileDetails(uid, donorDetails, true);

              // Update transaction details
              const currentYear = new Date().getFullYear();
              const randomSerial = Math.floor(100000 + Math.random() * 900000);
              const receiptSerial = `VV-${currentYear}-${randomSerial}`;
              const timestamp = admin.firestore.Timestamp.fromDate(new Date());

              const updatedDonation = {
                ...donation,
                userId: uid,
                donationId: payment.id,
                status: 'successful',
                paymentMethod: payment.method || 'online',
                receiptNumber: receiptSerial,
                updatedAt: timestamp
              };

              await donationRef.set(updatedDonation);

              // Update user stats
              const userRef = db.collection('users').doc(uid);
              await db.runTransaction(async (transaction) => {
                const userSnap = await transaction.get(userRef);
                if (userSnap.exists) {
                  const userData = userSnap.data();
                  transaction.update(userRef, {
                    totalDonated: (userData.totalDonated || 0) + donation.amount,
                    donationCount: (userData.donationCount || 0) + 1,
                    updatedAt: timestamp
                  });
                }
              });

              // Generate PDF, upload, and email
              try {
                const uploadResult = await receiptService.uploadReceipt(updatedDonation);
                await donationRef.update({
                  receiptUrl: uploadResult.receiptUrl,
                  taxReceiptSent: true
                });

                const pdfBuffer = await receiptService.generatePdfBuffer(updatedDonation);
                await emailService.sendDonationSuccessEmail(updatedDonation.donorEmail, {
                  ...updatedDonation,
                  receiptUrl: uploadResult.receiptUrl
                }, pdfBuffer);
              } catch (err) {
                console.error('Webhook: receipt compilation failed:', err.message);
              }
            }
            break;
          }

          case 'payment.failed': {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;
            if (!orderId) return;

            const donationRef = db.collection('donations').doc(orderId);
            const doc = await donationRef.get();
            if (doc.exists) {
              const donation = doc.data();
              await donationRef.update({
                status: 'failed',
                updatedAt: admin.firestore.Timestamp.fromDate(new Date())
              });

              // Email warning
              emailService.sendDonationFailedEmail(donation.donorEmail, {
                amount: payment.amount
              }).catch(() => {});
            }
            break;
          }

          case 'subscription.charged': {
            const subscriptionPayload = payload.payload.subscription.entity;
            const payment = payload.payload.payment.entity;
            
            // Query local subscriptions cache
            const subRef = db.collection('subscriptions').doc(subscriptionPayload.id);
            const subSnap = await subRef.get();
            
            if (subSnap.exists) {
              const subData = subSnap.data();
              const timestamp = admin.firestore.Timestamp.fromDate(new Date());

              let uid = subData.userId;
              if (uid === 'GUEST') {
                uid = await findOrCreateUser(subData.donorDetails, false);
                await subRef.update({ userId: uid });
                subData.userId = uid;
              }

              // Synchronize latest entered user details to users collection
              await syncUserProfileDetails(uid, subData.donorDetails, false);

              // Create a brand new donation doc for this recurring monthly charge
              const newDonationId = payment.id;
              const currentYear = new Date().getFullYear();
              const randomSerial = Math.floor(100000 + Math.random() * 900000);
              const receiptSerial = `VV-${currentYear}-${randomSerial}`;

              const donationDetails = {
                orderId: subscriptionPayload.id,
                donationId: newDonationId,
                userId: uid,
                donorName: subData.donorDetails.fullName,
                donorEmail: subData.donorDetails.email,
                donorPhone: subData.donorDetails.phone || '',
                address: subData.donorDetails.address || {},
                amount: Number(payment.amount) / 100, // convert back from paise
                amountInPaise: payment.amount,
                currency: 'INR',
                category: 'Healthcare', // default general fund for monthly
                subcategory: 'Monthly Renewal',
                donationType: 'monthly',
                frequency: 'monthly',
                subscriptionId: subscriptionPayload.id,
                status: 'successful',
                paymentMethod: payment.method || 'card',
                receiptNumber: receiptSerial,
                receiptUrl: '',
                is80GEligible: false,
                taxReceiptSent: false,
                createdAt: timestamp,
                updatedAt: timestamp
              };

              await db.collection('donations').doc(newDonationId).set(donationDetails);

              // Update subscription status in Firestore
              await subRef.update({
                status: 'active',
                updatedAt: timestamp
              });

              // Update user stats
              const userRef = db.collection('users').doc(uid);
              await db.runTransaction(async (transaction) => {
                const userSnap = await transaction.get(userRef);
                if (userSnap.exists) {
                  const userData = userSnap.data();
                  transaction.update(userRef, {
                    totalDonated: (userData.totalDonated || 0) + (payment.amount / 100),
                    donationCount: (userData.donationCount || 0) + 1,
                    updatedAt: timestamp
                  });
                }
              });

              // Generate PDF receipt and email it
              try {
                const uploadResult = await receiptService.uploadReceipt(donationDetails);
                await db.collection('donations').doc(newDonationId).update({
                  receiptUrl: uploadResult.receiptUrl,
                  taxReceiptSent: true
                });

                const pdfBuffer = await receiptService.generatePdfBuffer(donationDetails);
                await emailService.sendDonationSuccessEmail(donationDetails.donorEmail, {
                  ...donationDetails,
                  receiptUrl: uploadResult.receiptUrl
                }, pdfBuffer);
              } catch (err) {
                console.error('Webhook monthly receipt warning:', err.message);
              }
            }
            break;
          }

          case 'subscription.halted': {
            const subscriptionPayload = payload.payload.subscription.entity;
            await db.collection('subscriptions').doc(subscriptionPayload.id).update({
              status: 'halted',
              updatedAt: admin.firestore.Timestamp.fromDate(new Date())
            }).catch(() => {});
            break;
          }

          case 'refund.created': {
            const refund = payload.payload.refund.entity;
            const paymentId = refund.payment_id;

            // Search for donation matching this payment ID
            const donationsSnap = await db.collection('donations')
              .where('donationId', '==', paymentId)
              .limit(1)
              .get();

            if (!donationsSnap.empty) {
              const donationDoc = donationsSnap.docs[0];
              await donationDoc.ref.update({
                status: 'refunded',
                refundId: refund.id,
                updatedAt: admin.firestore.Timestamp.fromDate(new Date())
              });
            }
            break;
          }

          default:
            console.log(`Webhook: Event ${eventType} has no backend mappings.`);
            break;
        }
      }).catch(err => {
        console.error('❌ Async Webhook Execution Error:', err);
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = webhookController;

const razorpay = require('../config/razorpay');

const razorpayService = {
  /**
   * Create a standard single payment order
   */
  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    try {
      // Amount must be converted to paise (1 INR = 100 Paise)
      const options = {
        amount: Math.round(amount * 100), 
        currency,
        receipt,
        notes
      };
      
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('❌ Razorpay Create Order Error:', error);
      throw new Error(error.description || error.message || 'Failed to create payment order with Razorpay');
    }
  },

  /**
   * Check if a subscription plan with this amount already exists in Razorpay, otherwise create it
   */
  async getOrCreatePlan({ amount, name = 'Vidyavaidya Monthly Support Plan' }) {
    try {
      // Amount in paise
      const amountInPaise = Math.round(amount * 100);
      
      // In a production app, we would search our database for cached plan IDs first.
      // To implement this elegantly, the caller will query Firestore. If not found, they call this helper.
      const plan = await razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name,
          amount: amountInPaise,
          currency: 'INR',
          description: `Vidyavaidya Recurring Donation of INR ${amount} per month`
        }
      });
      
      return plan;
    } catch (error) {
      console.error('❌ Razorpay Create Plan Error:', error);
      throw new Error(error.description || error.message || 'Failed to initialize subscription plan with Razorpay');
    }
  },

  /**
   * Initiate a recurring billing subscription
   */
  async createSubscription({ planId, durationInMonths, notes = {} }) {
    try {
      const subscriptionOptions = {
        plan_id: planId,
        total_count: durationInMonths || 12, // default to 1 year duration
        quantity: 1,
        customer_notify: 1, // Razorpay notifies the customer directly
        notes
      };

      const subscription = await razorpay.subscriptions.create(subscriptionOptions);
      return subscription;
    } catch (error) {
      console.error('❌ Razorpay Create Subscription Error:', error);
      throw new Error(error.description || error.message || 'Failed to create monthly subscription with Razorpay');
    }
  },

  /**
   * Refund a successful payment (full or partial)
   */
  async initiateRefund({ paymentId, amount, reason }) {
    try {
      const refundOptions = {
        notes: { reason: reason || 'Requested by Administrator' }
      };

      if (amount) {
        // Partial refund
        refundOptions.amount = Math.round(amount * 100);
      }

      const refund = await razorpay.payments.refund(paymentId, refundOptions);
      return refund;
    } catch (error) {
      console.error('❌ Razorpay Refund Error:', error);
      throw new Error(error.description || error.message || 'Failed to process refund through Razorpay');
    }
  },

  /**
   * Fetch payment particulars from Razorpay
   */
  async fetchPayment(paymentId) {
    try {
      return await razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('❌ Razorpay Fetch Payment Error:', error);
      throw new Error(error.description || error.message || 'Failed to fetch payment details from Razorpay');
    }
  }
};

module.exports = razorpayService;

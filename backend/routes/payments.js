// routes/payments.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Project = require('../models/Project');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
   
    const { projects, amount } = req.body;

    if (!projects || projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projects to purchase'
      });
    }

    // Verify projects exist and calculate total amount
    const projectDocs = await Project.find({ _id: { $in: projects } });

    if (projectDocs.length !== projects.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more projects not found'
      });
    }

    const calculatedAmount = projectDocs.reduce((sum, project) => sum + project.price, 0);

    // Verify amount matches
    if (Math.abs(calculatedAmount - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        projectIds: projects.join(',')
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const order = await Order.create({
      user: req.user.id,
      projects,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: err.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      // Update order as failed
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: 'failed',
          paymentStatus: 'failed'
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid signature - Payment verification failed'
      });
    }

    // Update order as completed
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'completed',
        paymentStatus: 'success',
        completedAt: Date.now()
      },
      { new: true }
    ).populate('projects');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Add purchased projects to user's account
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: {
          purchasedProjects: { $each: order.projects.map(p => p._id) }
        }
      }
    );
    console.log('verified successfully');

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: err.message
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Razorpay webhook
// @access  Public (with signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;
    console.log("event",event);
    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      case 'order.paid':
        await handleOrderPaid(payload);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
   
    res.status(200).json({ success: true, received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: err.message
    });
  }
});

// Helper function to handle payment captured
async function handlePaymentCaptured(payload) {
  const payment = payload.payment.entity;
  const orderId = payment.order_id;

  await Order.findOneAndUpdate(
    { razorpayOrderId: orderId },
    {
      razorpayPaymentId: payment.id,
      status: 'completed',
      paymentStatus: 'success',
      completedAt: Date.now()
    }
  );
}

// Helper function to handle payment failed
async function handlePaymentFailed(payload) {
  const payment = payload.payment.entity;
  const orderId = payment.order_id;

  await Order.findOneAndUpdate(
    { razorpayOrderId: orderId },
    {
      status: 'failed',
      paymentStatus: 'failed'
    }
  );
}

// Helper function to handle order paid
async function handleOrderPaid(payload) {
  const order = payload.order.entity;

  await Order.findOneAndUpdate(
    { razorpayOrderId: order.id },
    {
      status: 'completed',
      paymentStatus: 'success',
      completedAt: Date.now()
    }
  );
}

module.exports = router;
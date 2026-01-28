require('dotenv').config();
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// Import Stripe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define route to handle payment
router.post("/stripe/create-payment-intent", async (req, res) => {
  try {
  const { amount } = req.body; // amount in cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "myr",
    automatic_payment_methods: {
    enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
});

module.exports = router;
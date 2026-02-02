import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv';
import { db } from '../db.js';
dotenv.config();
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.payment_method"]}
    );

    if (session.payment_status !== "paid") {
      return res.json({ paid: false });
    }

    const paymentIntent = session.payment_intent;

    if (session.payment_status === "paid") {
    const sql = `
      INSERT INTO transactions 
      (user_id, stripe_session_id, stripe_payment_intent, amount, currency, payment_status, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      session.metadata.user_id,
      session.id,
      paymentIntent.id,
      session.amount_total / 100,
      session.currency,
      session.payment_status,
      paymentIntent.payment_method_types?.[0] || "card"
    ]);

      return res.json({ paid: true });
    } else {
      return res.json({ paid: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
});

export default router;

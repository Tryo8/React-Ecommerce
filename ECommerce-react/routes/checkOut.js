

import Stripe from 'stripe'; 
import express from 'express';
import dotenv from 'dotenv';
import { verifyJWT } from '../model/verifyJWT.js';
dotenv.config({ silent: true });
const router = express.Router();
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_KEY);


router.post('/',verifyJWT, async(req, res) => {
    const { products } = req.body;
      console.log("🔹 req.user:", req.user);
    const lineItems = products.map((p) => ({
        price_data:{
            currency:"usd",
            product_data:{ 
                name: p.name,
                images: p.product_img ? [p.product_img] : [] 
            },
            unit_amount: Math.round(p.price * 100 )
        },
        quantity: Number(p.quantity || 1) 
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items: lineItems,
        mode:"payment",
        success_url:"http://localhost:5173/success-payment?session_id={CHECKOUT_SESSION_ID}",
        cancel_url:"http://localhost:5173/cancel-payment",
        metadata: {
            user_uuid: req.user.user_uuid
        }
    })
   res.json({ url: session.url }); 
});

export default router; 




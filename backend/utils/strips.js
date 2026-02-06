import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30", 
});

// Create payment intent helper
export const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert dollars to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  } catch (error) {
    console.error("Stripe Error:", error.message);
    throw new Error("Payment creation failed");
  }
};

export default stripe;

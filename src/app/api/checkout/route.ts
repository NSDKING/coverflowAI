import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-01-28.clover",
});

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price_data: {
        currency: "eur",
        product_data: { name: "50 Credits Pack" },
        unit_amount: 1000, // 10€
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  success_url: `${origin}/success`,
  cancel_url: `${origin}/cancel`,
  metadata: {
    userId: "USER_ID_HERE",  
    credits: 50,
  },
});

export {};

import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { CREDIT_PACKS } from "@/lib/credit-packs";

// If using Supabase, import your server client
// import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packId } = body;

    // 1️⃣ Validate pack
    const pack = CREDIT_PACKS[packId as keyof typeof CREDIT_PACKS];

    if (!pack) {
      return NextResponse.json(
        { error: "Invalid credit pack" },
        { status: 400 }
      );
    }

    // 2️⃣ Get logged in user
    // ⚠️ Replace this with your auth system
    const userId = "REPLACE_WITH_AUTH_USER_ID";

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const origin = req.headers.get("origin");

    // 3️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${pack.credits} Credits`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId,
        credits: pack.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

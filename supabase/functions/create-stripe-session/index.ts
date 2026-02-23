import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import Stripe from 'https://esm.sh/stripe@14.2.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BUNDLES = {
  starter: { amount: 200, credits: 25, name: "Pack Starter" },
  candidat: { amount: 500, credits: 100, name: "Pack Candidat" },
  expert: { amount: 1000, credits: 300, name: "Pack Expert" }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 1. Authentification
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("Authentification échouée");

    // 2. Récupération sécurisée du Body
    const body = await req.json();
    const bundleType = body.bundleType; 
    console.log("Bundle reçu du client:", bundleType);

    const selectedBundle = BUNDLES[bundleType as keyof typeof BUNDLES];

    if (!selectedBundle) {
      throw new Error(`Type de pack invalide ou manquant: ${bundleType}`);
    }

    // 3. Vérification du prix (évite le NaN)
    const unitAmount = Math.round(selectedBundle.amount);
    if (isNaN(unitAmount)) throw new Error("Erreur de calcul du montant");

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // 4. Création Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: selectedBundle.name },
          unit_amount: unitAmount, // Plus de calcul ici, on prend la valeur fixe
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        userId: user.id,
        credits: selectedBundle.credits.toString(),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Erreur Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { currentData, language = 'French' } = await req.json();

    const PROMPT = `
      Tu es un coach en carrière expert. Optimise ce CV JSON pour le rendre percutant.
      
      MISSIONS :
      1. RÉDACTION : Utilise des verbes d'action (ex: "Piloté", "Optimisé" au lieu de "A fait").
      2. SUMMARY : Écris un profil accrocheur de 3 lignes.
      3. SKILLS : Regroupe les compétences de manière logique.
      4. LANGUE : Tout doit être en ${language}.
      
      CONSIGNE STRICTE : Garde EXACTEMENT la même structure JSON que l'entrée.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: PROMPT },
          { role: "user", content: "JSON À OPTIMISER : " + JSON.stringify(currentData) }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await response.json();
    return new Response(aiData.choices[0].message.content, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
})
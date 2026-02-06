import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resume, jobDescription, tone = "professionnel" } = await req.json()
    const apiKey = Deno.env.get('OPENAI_API_KEY')

    if (!apiKey) throw new Error("Clé API OpenAI manquante")

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un expert en recrutement. Ton but est de rédiger une lettre de motivation complète, prête à être envoyée.
            
            INSTRUCTIONS D'EXTRACTION :
            - Analyse le CV pour trouver : Nom, Prénom, Adresse, Téléphone, Email.
            - Analyse l'offre pour trouver : Nom de l'entreprise, ville.

            STRUCTURE DE LA RÉPONSE :
            1. BLOC COORDONNÉES : Affiche les infos du candidat en haut à gauche.
            2. BLOC ENTREPRISE : Affiche les infos de l'entreprise juste en dessous à droite.
            3. OBJET : "Candidature au poste de [Nom du Poste]"
            4. CORPS : Utilise la méthode AIDA. Ton : ${tone}. Langue : Français.
            5. SIGNATURE : Termine par le nom du candidat.

            IMPORTANT : Remplace toutes les variables [Entre crochets] par les vraies infos du CV. Ne commence pas par "Voici votre lettre", commence directement par les coordonnées du candidat.` 
          },
          { 
            role: 'user', 
            content: `CV du candidat : ${resume}\n\nOffre d'emploi : ${jobDescription}` 
          }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
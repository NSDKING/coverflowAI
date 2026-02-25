import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 1. Configuration des headers CORS pour autoriser les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // 2. Gestion du Preflight (indispensable pour éviter l'erreur 500/CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeText, language = "French" } = await req.json()

    if (!resumeText) {
      throw new Error("Le texte du CV est manquant.")
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error("La clé API OpenAI n'est pas configurée sur Supabase.")
    }

    // 3. Le Prompt Expert pour l'extraction
    const systemPrompt = `Tu es un expert ATS Parser. Extrais les données du texte brut pour remplir ce schéma JSON exact.
    Langue de sortie : ${language}.
    
    RÈGLES :
    - Retourne UNIQUEMENT du JSON.
    - Si une info est manquante, utilise "" ou [].
    - Découpe les expériences en points précis dans le tableau "description".

    STRUCTURE JSON :
    {
      "personalInfo": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "photo": "" },
      "summary": "",
      "experiences": [{ "role": "", "company": "", "duration": "", "location": "", "description": [""] }],
      "education": [{ "degree": "", "school": "", "year": "", "location": "" }],
      "skills": [""],
      "additionalInfo": { "languages": [""], "certifications": [""], "interests": [""] }
    }`;

    // 4. Appel à OpenAI
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Modèle performant et économique
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Voici le texte à parser : ${resumeText}` }
        ],
        response_format: { type: "json_object" }, // Force la sortie JSON
        temperature: 0.1, // Basse température pour plus de fidélité aux données
      }),
    })

    const aiData = await aiResponse.json()
    
    if (aiData.error) {
      throw new Error(`OpenAI Error: ${aiData.error.message}`)
    }
    console.log("Réponse brute de l'IA :", aiData);
    let content = aiData.choices[0].message.content;
    content = content.replace(/^```json/i, "").replace(/```$/i, "").trim();
    console.log("text:", resumeText);
    const extractedData = JSON.parse(content);

    // 5. Retour des données au Frontend
    return new Response(
      JSON.stringify(extractedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error("Function Error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
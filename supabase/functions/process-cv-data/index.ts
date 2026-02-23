import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { resumeText } = await req.json();

    // On utilise l'API de Google Gemini ou OpenAI ici
    // Voici un exemple de structure de prompt pour obtenir du JSON pur
    const prompt = `
      Tu es un expert en recrutement. Analyse le texte du CV suivant et extrait les informations au format JSON uniquement.
      Structure :
      {
        "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "jobTitle": "" },
        "experiences": [{ "role": "", "company": "", "duration": "", "description": [] }],
        "education": [{ "degree": "", "school": "", "year": "" }],
        "skills": []
      }
      Texte du CV : ${resumeText}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", { // Ou Google AI
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Très bon pour l'extraction de données
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const structuredData = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(structuredData), {
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
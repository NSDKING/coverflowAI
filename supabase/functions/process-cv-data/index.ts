import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // 1. Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resumeText, language = "French" } = await req.json()

    if (!resumeText || resumeText.trim().length < 10) {
      throw new Error("Le texte du CV est trop court ou manquant.")
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error("Configuration: OPENAI_API_KEY manquante.")
    }

    const systemPrompt = `Tu es un expert ATS Parser. Extrais les données du texte brut pour remplir ce schéma JSON exact.
    Langue de sortie : ${language}.
    
    RÈGLES :
    - Retourne UNIQUEMENT du JSON valide.
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

    // 2. OpenAI Fetch with Timeout protection
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Texte à parser :\n\n${resumeText}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    clearTimeout(timeoutId);

    const aiData = await aiResponse.json();
    
    if (aiData.error) {
      throw new Error(`OpenAI API: ${aiData.error.message}`);
    }

    // 3. Sanitized Parsing
    let content = aiData.choices[0].message.content;
    
    // Safety: Remove markdown blocks if present despite json_object mode
    content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

    let extractedData;
    try {
      extractedData = JSON.parse(content);
    } catch (e) {
      console.error("JSON Parse Error. Content was:", content);
      throw new Error("L'IA a généré un format de données invalide.");
    }

    return new Response(
      JSON.stringify(extractedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const status = error.name === 'AbortError' ? 504 : 400;
    const message = error.name === 'AbortError' ? "L'IA a mis trop de temps à répondre." : error.message;
    
    return new Response(
      JSON.stringify({ error: message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: status 
      }
    )
  }
})
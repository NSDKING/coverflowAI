import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. On récupère resumeText, mais aussi language et currentData (optionnel)
    const { resumeText, language = 'French', currentData } = await req.json();

    // On prépare le contexte : est-ce une création ou une mise à jour ?
    const contextInfo = currentData 
      ? `Update and improve the following existing CV data: ${JSON.stringify(currentData)}`
      : `Create a new CV based on this raw text: ${resumeText}`;

    const CV_PROMPT = `
      You are a professional recruitment expert. Your goal is to provide a high-impact CV.
      
      STRICT INSTRUCTIONS:
      1. Language: You MUST write everything in ${language}.
      2. Tone: Professional, result-oriented, use action verbs.
      3. Content Quality: 
         - Write a "summary" (3-4 lines).
         - For each experience, generate 3 to 5 impactful "description" points.
         - Ensure the job title is catchy and matches the experience.
      4. Format: Return ONLY a valid JSON object matching the CVData interface.
      5. No Placeholder: Do NOT use "Lorem Ipsum" or generic text.

      JSON INTERFACE:
      {
        "personalInfo": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "" },
        "summary": "",
        "experiences": [{ "role": "", "company": "", "duration": "", "location": "", "description": [] }],
        "skills": [],
        "education": [{ "degree": "", "school": "", "year": "" }],
        "additionalInfo": { "languages": [], "certifications": [], "interests": [] }
      }
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
          { role: "system", content: CV_PROMPT },
          { role: "user", content: contextInfo + (resumeText ? "\nAdditional info: " + resumeText : "") }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const structuredData = JSON.parse(aiResult.choices[0].message.content);

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
});
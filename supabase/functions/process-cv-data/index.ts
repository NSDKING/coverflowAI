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
    const CV_EXTRACTION_PROMPT = `
    Tu es un expert en recrutement et en analyse de données. Analyse le texte brut suivant issu d'un CV PDF et transforme-le en un objet JSON structuré.

    RÈGLES DE NETTOYAGE STRICTES :
    1. SUPPRESSION DES PUCES : Retire tous les symboles de puces (•, -, *, ■) au début des phrases dans les descriptions.
    2. ENCODAGE : Corrige les erreurs d'encodage courantes (ex: remplace "d'Ã©tudes" par "d'études").
    3. CONCIS : Reformule les descriptions trop longues pour qu'elles soient percutantes.
    4. NORMALISATION : Assure-toi que les dates sont homogènes (ex: "Jan. 2020" ou "01/2020").
    5. SÉCURITÉ : Si une information est illisible ou manquante, utilise une chaîne vide "" ou un tableau vide [].

    STRUCTURE JSON ATTENDUE :
    {
      "personalInfo": { 
        "fullName": "Prénom Nom", 
        "jobTitle": "Titre du poste visé ou actuel", 
        "email": "email@example.com", 
        "phone": "06...", 
        "location": "Ville, Pays",
        "photo": "" 
      },
      "summary": "Bref résumé professionnel (2-3 phrases)",
      "experiences": [
        { 
          "role": "Intitulé du poste", 
          "company": "Nom de l'entreprise", 
          "duration": "Dates (ex: 2020 - 2023)", 
          "description": ["Action réalisée et résultat", "Responsabilité clé"] 
        }
      ],
      "skills": ["Compétence 1", "Compétence 2"],
      "education": [
        { "degree": "Nom du diplôme", "school": "École/Université", "year": "Année" }
      ]
    }

    TEXTE À ANALYSER :
    `;
    const response = await fetch("https://api.openai.com/v1/chat/completions", { // Ou Google AI
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Très bon pour l'extraction de données
        messages: [{ role: "user", content: CV_EXTRACTION_PROMPT + "\n\n" + resumeText }],
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
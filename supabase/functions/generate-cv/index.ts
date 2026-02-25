import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// --- IMPORTANT: DO NOT INITIALIZE SDKS HERE ---
// Wrong: const client = new SomeSDK({ apiKey: process.env.API_KEY });
// This runs during 'npm run build' when process.env is empty, causing the crash.

export async function POST(req: Request) {
  try {
    // 1. Get the API Key INSIDE the function
    const apiKey = process.env.OPENAI_API_KEY; // Or your specific service key

    if (!apiKey) {
      console.error("Build/Runtime Error: API Key is missing.");
      return NextResponse.json(
        { error: "Server configuration error (Missing API Key)" },
        { status: 500 }
      );
    }

    // 2. Initialize your client HERE if using an SDK
    // const client = new SomeSDK({ apiKey });

    // 3. Parse the request body
    const body = await req.json();
    const { pdfText, language = 'French' } = body;

    if (!pdfText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 4. Example logic: Calling your Supabase Edge Function or OpenAI
    // We use a try-catch for the specific fetch call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `Extract CV data in ${language}. Return JSON only.` 
          },
          { role: "user", content: pdfText }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "AI Extraction failed");
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Route Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process PDF: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * 5. FORCE DYNAMIC
 * This tells Next.js NOT to try and pre-render this route as a static page 
 * during 'npm run build'. This is the ultimate "shield" against build errors.
 */
export const dynamic = 'force-dynamic';
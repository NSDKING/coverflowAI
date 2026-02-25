import { NextResponse } from 'next/server';

// ❌ DO NOT initialize clients here (top-level)
// const pdfParser = new SomePDFTool({ apiKey: process.env.API_KEY }); 

export async function POST(req: Request) {
  // ✅ DO initialize inside the function
  const apiKey = process.env.API_KEY; 
  
  if (!apiKey) {
    console.error("Missing API Key");
    return NextResponse.json({ error: "Configuration error" }, { status: 500 });
  }

  // Example: if you use an external tool like Adobe, Mistral, or a PDF SDK
  // const client = new Tool({ apiKey }); 

  try {
    const body = await req.json();
    // ... logic ...
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Add this to prevent Next.js from trying to pre-render this route as static
export const dynamic = 'force-dynamic';
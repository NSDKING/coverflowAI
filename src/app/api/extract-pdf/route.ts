import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Importation dynamique pour éviter l'erreur au build
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    console.error("Erreur extraction PDF:", error);
    return NextResponse.json({ error: "Erreur lors de la lecture du PDF" }, { status: 500 });
  }
}
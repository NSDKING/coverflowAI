
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const tonePrompts : Record<string, string> = {
  mendiant: "Write in a pleading, desperate tone. Emphasize that I need this job to survive.",
  pro: "Write a standard, high-level professional corporate letter.",
  bold: "Write in a 'si tu veux tu ne m'embauche pas' style. Extremely confident, almost arrogant, focusing on why they would be fools to miss out on me.",
  ghost: "Write like an elite fixer. Short, punchy sentences. Deeply analytical."
};

// Inside your generate function:

export async function POST(req: Request) {
    const { cvText, jobDescription, tone } = await req.json();
    const prompt = `${tonePrompts[tone]} using this CV: ${cvText}...`;

  const result = await streamText({
    model: openai('gpt-4o'),
    prompt: `${prompt} and this Job Description: ${jobDescription}`,
  });

  return result.toDataStreamResponse();
}
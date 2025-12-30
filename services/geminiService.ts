
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AccessiReport } from "../types";

const PROMPT = `
You are the core AI engine of "AccessiPilot," a real-time accessibility engine.
Analyze the provided image (a screenshot or view of a webpage) and generate a report.

Format your response exactly like this:
NARATION: [concise flowing paragraph for screen reader]
ALT_TEXT: [item1: alt text], [item2: alt text]
ISSUE: [most critical barrier name]
WCAG: [reference code and name]
FIX: [technical fix]
COMMAND: accessipilot-adjust: property="[prop]" ; value="[val]" ; target="[selector]"

Guidelines:
1. Narration should be under 150 words.
2. If decorative, use "Decorative image, alt=\"\"."
3. Focus on contrast, keyboard accessibility, or semantics.
4. If no specific voice request is implied, suggest a common fix like 'filter: contrast(120%)' on body or 'font-size: 1.1em'.
`;

export async function analyzeAccessibility(base64Image: string): Promise<AccessiReport> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing. Please check your environment.");

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
          { text: PROMPT }
        ]
      }
    });

    const text = response.text;
    return parseGeminiResponse(text);
  } catch (error: any) {
    console.error("Gemini analysis failed:", error);
    throw new Error(error.message || "Failed to analyze image");
  }
}

function parseGeminiResponse(text: string): AccessiReport {
  const lines = text.split('\n');
  const findValue = (prefix: string) => lines.find(l => l.startsWith(prefix))?.replace(prefix, '').trim() || '';

  return {
    narration: findValue('NARATION:'),
    altText: findValue('ALT_TEXT:').split(',').map(t => t.trim()).filter(Boolean),
    priorityIssue: {
      issue: findValue('ISSUE:'),
      wcag: findValue('WCAG:'),
      fix: findValue('FIX:')
    },
    command: findValue('COMMAND:')
  };
}

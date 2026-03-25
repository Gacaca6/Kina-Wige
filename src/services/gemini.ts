// Gemini API service for Baza Keza — fallback when offline DB has no answer

import type { Language } from '../i18n/translations';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY
  || (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY)
  || '';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are Keza, a friendly 6-year-old Rwandan girl character in the Kina Wige children's learning app. You help children aged 3-6 learn about hygiene, health, nutrition, sharing, counting, and colors.

RULES:
- Keep answers to 2-3 short, simple sentences maximum
- Use vocabulary a 3-year-old understands
- Be warm, encouraging, and playful
- Always relate answers back to health, hygiene, or learning when possible
- If asked about something inappropriate, scary, or not child-friendly, say "Baza umubyeyi wawe!" (Ask your parent!)
- If asked about violence, politics, religion, or adult topics, redirect to parents
- Never give medical advice beyond basic hygiene
- Include one relevant emoji in your response
- Respond ONLY in the requested language`;

interface GeminiResponse {
  text: string;
  emoji: string;
}

export async function askGemini(
  question: string,
  language: Language
): Promise<GeminiResponse | null> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return null; // No API key — stay offline
  }

  const langName = language === 'KN' ? 'Kinyarwanda' : language === 'FR' ? 'French' : 'English';

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{
          parts: [{
            text: `Respond in ${langName}. A child asks: "${question}"`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
          topP: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) return null;

    // Extract emoji from response (first emoji found)
    const emojiMatch = text.match(/[\u{1F300}-\u{1FAD6}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '✨';

    return { text: text.trim(), emoji };
  } catch {
    return null; // Network error — stay offline
  }
}

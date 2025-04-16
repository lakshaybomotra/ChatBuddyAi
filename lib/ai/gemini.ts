import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-2.0-flash';
const IMAGE_MODEL_NAME = 'gemini-pro-vision';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('Missing Gemini API key. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenAI({ apiKey });

/**
 * Converts messages to the format expected by @google/genai
 */
function toGenAIContents(messages: { role: string; content: string }[]) {
  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
}

/**
 * Sends a chat message to Gemini and returns the response text.
 */
export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
  try {
    console.log('Gemini API call', messages);
    const contents = toGenAIContents(messages);

    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
    });

    // The response object contains candidates, take the first one
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return `Gemini API Error: ${error.message || error}`;
  }
}

/**
 * Generates an image from a prompt using Gemini.
 * Returns a base64 data URL string.
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Debug: log the full response for troubleshooting
    console.log('Gemini image generation response:', JSON.stringify(response, null, 2));

    // Try to extract image data from the response
    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    // If no image data found, log the response and throw
    throw new Error('No image data returned from Gemini');
  } catch (error: any) {
    console.error('Gemini Image API error:', error);
    return `Gemini Image API Error: ${error.message || error}`;
  }
}

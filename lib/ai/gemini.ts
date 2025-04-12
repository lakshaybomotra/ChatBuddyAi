import {GoogleGenerativeAI} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";

async function generateResponse(prompt: string) {
    const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log(response);
    return response.text();
}

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
    // Format Gemini request
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    // Return assistant's message
    try {
        return await generateResponse(prompt);
    } catch (error: any) {
        console.error("Gemini API error:", error);
        return `Gemini API Error: ${error.message}`;
    }
}

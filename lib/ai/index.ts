import { AI_PROVIDER } from './config';
import { sendMessage as sendGemini } from './gemini';
import { sendMessage as sendAzure } from './azure';

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
    switch (AI_PROVIDER) {
        case 'gemini':
            return await sendGemini(messages);
        case 'azure':
            return await sendAzure(messages);
        default:
            throw new Error('Unsupported AI provider');
    }
}

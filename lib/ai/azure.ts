const { AzureOpenAI } = require('openai');

const apiKey = process.env.EXPO_PUBLIC_AZURE_OPENAI_API_KEY;
const apiVersion = process.env.EXPO_PUBLIC_AZURE_OPENAI_API_VERSION;
const endpoint = process.env.EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT;
const modelName = process.env.EXPO_PUBLIC_AZURE_OPENAI_MODEL;
const deployment = process.env.EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT;
const options = { endpoint, apiKey, deployment, apiVersion }

export async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
    console.log("Azure OpenAI call", messages);
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    const client = new AzureOpenAI(options);

    let formattedMessages = [...messages];

    if (!formattedMessages.some(m => m.role === 'system')) {
        formattedMessages.unshift({
            role: "system",
            content: "You are ChatBuddy AI, a helpful assistant. Answer questions accurately and provide helpful information."
        });
    }
    console.log(formattedMessages);

    try {
        const response = await client.chat.completions.create({
            messages: formattedMessages,
            max_tokens: 4096,
            temperature: 1,
            top_p: 1,
            model: modelName
        });
        return response.choices[0].message.content;

    } catch (error: any) {
        console.error("Azure API error:", error);
        return `Azure API Error: ${error.message}`;
    }
}


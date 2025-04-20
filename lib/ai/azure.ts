const { AzureOpenAI } = require('openai');

const apiKey = process.env.EXPO_PUBLIC_AZURE_OPENAI_API_KEY;
const apiVersion = process.env.EXPO_PUBLIC_AZURE_OPENAI_API_VERSION;
const endpoint = process.env.EXPO_PUBLIC_AZURE_OPENAI_ENDPOINT;
const modelName = process.env.EXPO_PUBLIC_AZURE_OPENAI_MODEL;
const deployment = process.env.EXPO_PUBLIC_AZURE_OPENAI_DEPLOYMENT;
const options = { endpoint, apiKey, deployment, apiVersion }
const IMAGE_MODEL_NAME = process.env.EXPO_PUBLIC_AZURE_OPENAI_IMAGE_MODEL;
const IMAGE_DEPLOYMENT = process.env.EXPO_PUBLIC_AZURE_OPENAI_IMAGE_DEPLOYMENT;
const IMAGE_API_VERSION = process.env.EXPO_PUBLIC_AZURE_OPENAI_IMAGE_API_VERSION;

const imageOptions = { endpoint, apiKey, deployment: IMAGE_DEPLOYMENT, apiVersion: IMAGE_API_VERSION }

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

/**
 * Generates an image from a prompt using the AzureOpenAI client.
 * @param {string} prompt
 * @returns {Promise<{ text: string; imageUri: string }>}
 */
export async function generateImage(prompt : string): Promise<{ text: string; imageUri: string }> {
    try {
      const client = new AzureOpenAI(imageOptions);

      const result = await client.images.generate({
        model: IMAGE_MODEL_NAME,
        prompt,
        size: '1024x1024',
        n: 1,
        quality: 'hd'
      });
  
      console.log('Azure image generation result:', result);
      const imageUri = result.data?.[0]?.url;
      if (!imageUri) {
        return {
          text: 'No image URL returned by the service.',
          imageUri: ''
        };
      }
  
      return {
        text: 'Here is your generated image.',
        imageUri
      };
    } catch (err: any) {
      console.error('Azure image generation error:', err);
      return {
        text: `Azure image generation error: ${err.message}`,
        imageUri: ''
      };
    }
  }
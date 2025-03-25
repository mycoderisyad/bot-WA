import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAIResponse(message: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'Kamu adalah asisten yang membantu customer toko online.' }, { role: 'user', content: message }]
    });
    return response.choices[0].message?.content || 'Maaf, saya tidak mengerti.';
}

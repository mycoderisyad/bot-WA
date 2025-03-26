// import OpenAI from 'openai';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function generateAIResponse(message: string) {
//     const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'system', content: 'Kamu adalah asisten yang membantu customer toko online. bantu menjadi admin atau customer service penjualana dengan menjawab atau membantu pembeli dengan menyambut, mengarahkan, dan memberi tahu tutorial beli dan lain lain' }, { role: 'user', content: message }]
//     });
//     return response.choices[0].message?.content || 'Maaf, saya tidak mengerti.';
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(userText: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Kamu adalah asisten penjual di toko online. Tugasmu adalah membantu pelanggan memahami cara membeli produk. 
        Panduan yang harus kamu berikan:
        1. Jika pelanggan menanyakan stok, arahkan ke perintah "#stok".
        2. Jika pelanggan ingin mendaftar, arahkan ke perintah "#daftar".
        3. Jika pelanggan ingin membeli, beri contoh cara menggunakan perintah "#beli-kodeproduk-jumlah".
        4. Jawablah dengan profesional dan ramah seperti manusia.
        5. Jawab dengan text yang rapi, jelas, terstruktur, dan informatif.

        Pelanggan: "${userText}"
        `;

        const result = await model.generateContent(prompt);
        return result.response.text() || "Maaf, saya tidak bisa menjawab saat ini.";
    } catch (error) {
        console.error("Error AI:", error);
        return "Maaf, terjadi kesalahan dengan sistem AI.";
    }
}

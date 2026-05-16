import OpenAI from 'openai';
import https from 'https';
import fs from 'fs';
import path from 'path';
import nodeFetch from 'node-fetch';

// Load the Techloq corporate CA certificate to trust SSL inspection on this network.
const certPath = path.join(__dirname, '..', 'certs', 'corporate-ca.crt');
const ca = fs.readFileSync(certPath);
const agent = new https.Agent({ ca });

export async function generateLesson(category: string, prompt: string): Promise<string> {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        fetch: (url: any, init?: any) => nodeFetch(url, { ...init, agent }) as any
    });

    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a professional teacher. Provide a clear and structured lesson on the requested topic.'
            },
            {
                role: 'user',
                content: `Category: ${category}\nPrompt: ${prompt}`
            }
        ]
    });
    return completion.choices[0].message.content ?? '';
}

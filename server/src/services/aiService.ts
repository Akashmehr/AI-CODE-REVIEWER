import OpenAI from 'openai';

export const reviewCode = async (code: string, language: string): Promise<string> => {

    const client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY as string,
    });

    const response = await client.chat.completions.create({
        model: 'openrouter/free',  // ✅ Auto picks best free model
        messages: [
            {
                role: 'user',
                content: `You are an expert code reviewer.
Review the following ${language} code and provide:
1. 🐛 Bugs found
2. ✅ What is good
3. 💡 Improvements & best practices
4. ⚡ Performance tips
5. 📊 Score out of 10

Code:
\`\`\`${language}
${code}
\`\`\`

Be specific and beginner-friendly.`
            }
        ],
    });

    return response.choices[0].message.content as string;
};
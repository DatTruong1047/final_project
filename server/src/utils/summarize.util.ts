import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@app/config/env.config';
import { geminiModel, promptSummarize, systemInstructionSummarize } from '@app/config/llm.config';

const googleGenerativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const summarize = async (inputText: string) => {
  try {
    const prompt = promptSummarize(inputText);
    const model = googleGenerativeAI.getGenerativeModel({ model: geminiModel });

    const result = await model.generateContent({
      generationConfig: {
        temperature: 0.5,
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstructionSummarize }],
      },
    });

    const response = result.response;
    const text = response.text().trim();
    return text;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return '';
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function processProductJSON(inputPath: string, outputPath: string) {
  const data = await fs.readFile(inputPath, 'utf-8');
  const products = JSON.parse(data);
  let i = 1;    

  for (const product of products) {
    const description = product.long_description;
    const summary = await summarize(description);

    console.log(`🔄 [${i}/${products.length}] Summarizing "${product.name}"...`);
    product.summary = summary;
    await sleep(1000);
    i++;
  }

  await fs.writeFile(outputPath, JSON.stringify(products, null, 2));
}

const inputPath = path.join(__dirname, '../../data/all_products.json');
const outputPath = path.join(__dirname, '../../data/summarized_products.json');
processProductJSON(inputPath, outputPath);

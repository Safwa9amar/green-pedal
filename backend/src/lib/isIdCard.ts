import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export default async function isIdCard(filePath: string): Promise<boolean> {
  // نستخدم موديل يدعم الصور
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const imageBytes = fs.readFileSync(filePath);

  const prompt = `
    You are an image validator. 
    Look at this image and answer ONLY with "yes" if it is clearly a government-issued ID card 
    (identity card, passport, driver license, etc.), otherwise answer "no".
    Do not explain, just output "yes" or "no".
  `;

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBytes.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    { text: prompt },
  ]);

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text
    ?.trim()
    .toLowerCase();

  return text === "yes";
}

// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export default async function generateProfileFromIdCard(filePath: string) {
  // Choose a model that supports multimodal generateContent
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // or a supported one in your API
  });

  const imageBytes = fs.readFileSync(filePath);

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBytes.toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    {
      text: "Extract the person's face photo from this ID card and generate a clean square profile picture (no text).",
    },
  ]);

  const base64Image =
    result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Image) {
    throw new Error("No image returned from Gemini");
  }

  const buffer = Buffer.from(base64Image, "base64");
  const profilePath = filePath.replace("-id-card.jpg", "-profile.jpg");
  fs.writeFileSync(profilePath, buffer);
  return profilePath;
}

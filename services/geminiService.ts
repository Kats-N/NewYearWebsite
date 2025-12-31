
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a cinematic Japanese New Year image based on user input.
 * Uses the gemini-2.5-flash-image model as per guidelines.
 */
export async function generateNewYearImage(userInput: string): Promise<string> {
  // Ensure the API key is present for better error reporting.
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
    console.error("Gemini API Key is missing in the build environment.");
    throw new Error("APIキーが正しく設定されていません。再デプロイを試してください。");
  }

  // Initialize GoogleGenAI with the API key from environment variables directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `A cinematic and artistic Japanese New Year visual: "${userInput}". 
  Style: Modern traditional Japanese art, vibrant colors with gold and vermilion accents. 
  Themes: Festive motifs like Mizuhiki, pine, cherry blossoms, and sun. 
  CRITICAL: DO NOT include any text, Kanji, or words. Purely visual.`;

  try {
    // Calling generateContent to generate images with the gemini-2.5-flash-image model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("画像が生成されませんでした。別の言葉を試してください。");
    }

    // Iterate through all parts to find the image part, as recommended for nano banana series models.
    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        // Return the extracted base64 image string.
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("画像データが応答に含まれていませんでした。");
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", error);
    // Safety filters or other blocks are handled gracefully here.
    if (error.message?.includes("Safety")) {
      throw new Error("不適切な表現が含まれている可能性があるため、画像を生成できませんでした。");
    }
    throw error;
  }
}

import { GoogleGenAI } from "@google/genai";

export async function generateNewYearImage(userInput: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined") {
    console.error("Gemini API Key is missing in the build environment.");
    throw new Error("APIキーが正しく設定されていません。再デプロイを試してください。");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `A cinematic and artistic Japanese New Year visual: "${userInput}". 
  Style: Modern traditional Japanese art, vibrant colors with gold and vermilion accents. 
  Themes: Festive motifs like Mizuhiki, pine, cherry blossoms, and sun. 
  CRITICAL: DO NOT include any text, Kanji, or words. Purely visual.`;

  try {
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

    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("画像データが応答に含まれていませんでした。");
  } catch (error: any) {
    console.error("Gemini API Detailed Error:", error);
    // 安全フィルターなどでブロックされた場合もここに来ます
    if (error.message?.includes("Safety")) {
      throw new Error("不適切な表現が含まれている可能性があるため、画像を生成できませんでした。");
    }
    throw error;
  }
}

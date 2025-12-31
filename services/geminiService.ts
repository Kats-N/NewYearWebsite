
import { GoogleGenAI } from "@google/genai";

export async function generateNewYearImage(userInput: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  /**
   * 文字化け・中国語風文字を避けるための新戦略:
   * 1. 「文字・テキストを一切排除」することを最優先の指示とする。
   * 2. 「書道 (Calligraphy)」という単語自体が文字を誘発するため、これを削除。
   * 3. 象徴的な「モチーフ」と「雰囲気」に焦点を当てる。
   */
  const prompt = `A cinematic and artistic Japanese New Year visual: "${userInput}". 
  Style: Modern traditional Japanese art, vibrant colors with gold and vermilion accents. 
  Themes: Festive motifs like Mizuhiki (decorative cords), pine needles, cherry blossoms, and rising sun. 
  Technical specs: Sharp focus, 8k resolution, elegant composition, high-end seasonal aesthetic. 
  CRITICAL INSTRUCTION: DO NOT include any text, letters, Kanji, alphabets, or words. 
  Absolutely NO calligraphy. Ensure the image is purely visual and wordless.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("画像の生成に失敗しました。");
    }

    // Find the image part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("画像データが見つかりませんでした。");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}


import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeWish = async (wish: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment and imagery of this Christmas wish: "${wish}". Determine if it feels 'warm' (reds/golds), 'cool' (blues/silvers), or 'luxurious' (emeralds/golds). Respond in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['warm', 'cool', 'luxurious'] },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            message: { type: Type.STRING }
          },
          required: ['sentiment', 'colorPalette', 'message']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { sentiment: 'luxurious', colorPalette: ['#064e3b', '#fbbf24'], message: "Arix signature elegance." };
  }
};

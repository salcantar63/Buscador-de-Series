import { GoogleGenAI } from "@google/genai";
import { SeriesInfo, GroundingChunk, ActorInfo } from '../types';

const fetchSeriesInfo = async (seriesName: string): Promise<{ seriesInfo: SeriesInfo, sources: GroundingChunk[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Eres un experto en series de televisión. Encuentra información detallada y actualizada para la serie: "${seriesName}".
    Toda la información de texto en la respuesta JSON debe estar en español de Latinoamérica.
    Proporciona la respuesta como un único objeto JSON válido. No incluyas ningún texto antes o después del objeto JSON. No uses comillas invertidas de markdown como \`\`\`json.
    El objeto JSON debe tener la siguiente estructura:
    {
      "title_en": "Original English Title",
      "title_es": "Título en español de Latinoamérica",
      "title_mx": "Título con el que se conoció la serie específicamente en México. DEVUELVE NULL si no se encuentra un título específico para México o si es idéntico al 'title_es'.",
      "description": "Un resumen breve y atractivo de la trama de la serie y de qué trata.",
      "seasons": [
        { "season": 1, "episodes": 10, "air_date": "YYYY-MM-DD" },
        { "season": 2, "episodes": 12, "air_date": "YYYY-MM-DD" }
      ],
      "original_air_date": "YYYY-MM-DD",
      "original_platform": "Nombre de la plataforma/canal",
      "current_platform": "Nombre de la plataforma/canal actual, o si se está emitiendo actualmente, indica 'En emisión en [Canal] los [Días] a las [Hora]'",
      "is_airing": true,
      "poster_url": "URL pública y directa al póster de la serie. La URL DEBE terminar en .jpg, .png, o .webp. Si no encuentras una URL que cumpla este requisito, devuelve null.",
      "imdb_rating": "Calificación de IMDB como cadena de texto, ej., '8.7/10'",
      "cast": [
        { "name": "Nombre del Actor", "character": "Nombre del Personaje" },
        { "name": "Otro Actor", "character": "Otro Personaje" }
      ],
      "similar_series": [
        { "title": "Nombre de Serie Similar", "reason": "Breve explicación de por qué le gustaría al espectador." },
        { "title": "Otra Serie Similar", "reason": "Otra breve explicación." }
      ]
    }
    Si alguna información no está disponible, usa null como valor para esa clave. Para 'is_airing', usa un booleano (true o false). Para 'seasons', 'cast' y 'similar_series', si no se encuentra información, devuelve un array vacío []. Para cada temporada, incluye la fecha de estreno de esa temporada ('air_date').
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

  try {
    // FIX: The response with grounding might include extra text around the JSON object.
    // This logic extracts the JSON object from the response string before parsing.
    let text = response.text.trim();
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    const seriesInfo: SeriesInfo = JSON.parse(text);
    return { seriesInfo, sources };
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response text:", response.text);
    throw new Error("Could not process the information for the series. The format received was invalid.");
  }
};

export const fetchActorInfo = async (actorName: string): Promise<ActorInfo> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Busca información sobre el actor/actriz: "${actorName}".
    Proporciona la respuesta como un único objeto JSON válido, sin texto adicional ni markdown.
    El objeto debe tener esta estructura:
    {
      "photo_url": "URL pública y directa a una foto del actor/actriz. La URL DEBE terminar en .jpg, .png, o .webp. Si no encuentras una URL que cumpla este requisito, devuelve null.",
      "other_series": ["Nombre de otra serie notable", "Otra serie importante"]
    }
    Si no encuentras información, usa null para 'photo_url' y un array vacío [] para 'other_series'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  try {
    let text = response.text.trim();
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
      text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }
    const actorInfo: ActorInfo = JSON.parse(text);
    return actorInfo;
  } catch (e) {
    console.error("Failed to parse actor info response:", e);
    console.error("Raw actor response text:", response.text);
    throw new Error("No se pudo procesar la información del actor.");
  }
};


export default fetchSeriesInfo;
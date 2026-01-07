
import { GoogleGenAI, Type } from "@google/genai";

// A chave será substituída pelo Vite durante o build
const apiKey = process.env.API_KEY || "";

export const summarizeWebsite = async (url: string) => {
  if (!apiKey) {
    throw new Error("API_KEY não configurada no ambiente do Vercel.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o site ${url}. 
      1. Forneça um resumo executivo claro, objetivo e profissional do seu conteúdo em português.
      2. Identifique a categoria principal (ex: E-commerce, Blog, Institucional, Governamental, Portfólio, Notícias).
      3. Verifique se o site parece estar ativo e qual sua principal finalidade.
      
      Retorne APENAS um objeto JSON com as chaves "summary" e "category".`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Resumo detalhado do conteúdo e propósito do site.'
            },
            category: {
              type: Type.STRING,
              description: 'Categoria simplificada do site.'
            }
          },
          required: ['summary', 'category']
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou uma resposta válida.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Erro no Gemini:', error);
    throw new Error('Falha ao analisar o conteúdo do site. A URL pode estar inacessível ou protegida.');
  }
};

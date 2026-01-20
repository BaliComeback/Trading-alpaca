
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

export const getTradingAdvice = async (history: Message[]): Promise<string> => {
  try {
    // Siempre creamos una instancia fresca para usar la llave más reciente inyectada
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `Eres el "Titan Quantum Mentor v51.0". 
        
        ESTADO DE SEGURIDAD:
        Has sido reiniciado con una llave verificada tras una filtración. 
        Eres un experto en trading algorítmico y seguridad de datos.
        
        TU MISIÓN:
        Ayudar al usuario a programar bots en Python con Alpaca. 
        Si el usuario pregunta por el error 403 anterior, confirma que la terminal ha sido re-autorizada con éxito y que es seguro continuar.
        Siempre prioriza el manejo de secretos mediante archivos .env en tus ejemplos de código.`,
        temperature: 0.8
      }
    });
    
    return response.text || "Error: El núcleo de respuesta devolvió un estado nulo.";
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("403")) {
      return "⚠️ ERROR DE SEGURIDAD: La llave actual ha sido rechazada por el servidor. Por favor, pulsa el botón 'RE-VINCULAR LLAVE' en el encabezado del terminal para solucionar este problema.";
    }
    
    return `Error en el núcleo Phoenix: ${error.message || "Fallo de conexión"}`;
  }
};

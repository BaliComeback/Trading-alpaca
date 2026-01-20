
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

export const getTradingAdvice = async (history: Message[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `Eres "Titan Alpha Architect v46.0". 
        
        ESTADO ACTUAL:
        El bot del usuario ya es estable. Hemos pasado de "mensajes de prueba" a una estrategia real de RSI (Relative Strength Index).
        
        CONCEPTOS CLAVE PARA EL USUARIO:
        1. RSI (Índice de Fuerza Relativa): Mide la velocidad de los cambios de precio. 
           - Por debajo de 30: El activo está "barato" o sobrevendido.
           - Por encima de 70: El activo está "caro" o sobrecomprado.
        2. El bot ahora consulta el precio real de AAPL cada minuto.
        
        INSTRUCCIÓN:
        Felicita al usuario por estabilizar el sistema. Explícale que ahora el bot está analizando el mercado real. Pregúntale si quiere ajustar los umbrales del RSI (por ejemplo, ser más conservador con 20/80) o si prefiere cambiar el activo de AAPL a algo más volátil como Tesla (TSLA) o Bitcoin (BTCUSD).`,
        temperature: 0.7
      }
    });
    
    return response.text || "Estrategia Alpha v46.0 lista para ejecución.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Error de enlace con el núcleo Alpha.";
  }
};

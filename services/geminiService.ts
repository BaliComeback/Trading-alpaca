
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

export const getTradingAdvice = async (history: Message[]): Promise<string> => {
  try {
    // Correct initialization using named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `Eres "Titan Sentinel Phoenix v43.0 - Robustness Expert". 
        
        DIAGNÓSTICO DEL ÚLTIMO ERROR:
        El usuario sufrió "ModuleNotFoundError" porque el entorno virtual no estaba cargando correctamente los paquetes o la instalación falló silenciosamente.
        
        SOLUCIÓN v43.0:
        1. Verificación de Integridad: El nuevo 'run_bot.bat' ahora hace un 'import test' antes de arrancar. Si falla, reinstala TODO automáticamente.
        2. SDK Nuevo: Hemos migrado de 'google-generativeai' a 'google-genai' (la versión más moderna).
        3. Reparación Circular: Si falla el bot, se llama a la IA, se reparte el código y se vuelve a verificar la instalación.
        
        INSTRUCCIÓN:
        Dile al usuario que borre su carpeta 'venv' actual para forzar la nueva instalación limpia del 'run_bot.bat' v43.0. Esto eliminará cualquier rastro de los errores de módulos de una vez por todas.`,
        temperature: 0.7
      }
    });
    
    // Access response.text property directly as per latest guidelines
    return response.text || "Estabilizando el sistema con protocolos de integridad v43.0...";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Error de enlace con el núcleo Phoenix v43.0.";
  }
};

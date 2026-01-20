import google.generativeai as genai
import os

# REEMPLAZA ESTO CON TU LLAVE DE GOOGLE AI STUDIO
API_KEY = "AIzaSyAyBLacc1t7JKZ5oVomVBPjnvps4xxjKtg"

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def auto_reparar():
    try:
        # Leer el código que falló (asumiendo que es main.py)
        with open("main.py", "r") as f:
            codigo_original = f.read()

        # Leer el último error del log
        with open("logs/bot_runtime.log", "r") as f:
            error = f.readlines()[-5:]

        prompt = f"""
        Actúa como un experto en Python. Mi bot de trading falló.
        ERROR: {error}
        CÓDIGO ACTUAL:
        {codigo_original}
        
        Responde ÚNICAMENTE con el código completo corregido, sin explicaciones, 
        para que pueda sobrescribir el archivo directamente.
        """

        response = model.generate_content(prompt)
        nuevo_codigo = response.text.replace("```python", "").replace("```", "").strip()

        # SOBREESCRITURA AUTOMÁTICA (Auto-reparación física)
        with open("main.py", "w") as f:
            f.write(nuevo_codigo)
            
        print("✅ Archivo main.py reparado automáticamente por Gemini.")

    except Exception as e:
        print(f"❌ Error en la autoreparación: {e}")

if __name__ == "__main__":
    auto_reparar()
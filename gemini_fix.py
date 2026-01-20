
from google import genai
import os, time, traceback
from dotenv import load_dotenv

# Protocolo Phoenix v49.0
# Sincronización automática de llaves y recuperación de desastres
load_dotenv()
API_KEY = os.getenv("GENAI_API_KEY", "AIzaSyATjFX9ql3TTUolL2EWFx0uco1n2ojIPdc")

def auto_reparar():
    print("\n" + "!"*50)
    print("  PHOENIX PROTOCOL v49.0: RECOVERY ACTIVE")
    print("!"*50)
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        # Aseguramos que el cliente use la llave más reciente
        client = genai.Client(api_key=API_KEY)
        
        # 1. Leer código fallido
        if not os.path.exists("main.py"):
            print("❌ PHOENIX: main.py no encontrado.")
            return
            
        with open("main.py", "r") as f:
            old_code = f.read()

        # 2. Leer contexto del error
        error_data = "Log vacío."
        if os.path.exists("logs/bot_runtime.log"):
            with open("logs/bot_runtime.log", "r") as f:
                error_data = "".join(f.readlines()[-25:])

        # 3. Solicitar parche a la IA
        prompt = f"""
        MODO REPARACION DE EMERGENCIA:
        Error detectado en el bot de trading Alpaca.
        
        LOGS DE ERROR:
        {error_data}
        
        CODIGO FUENTE ACTUAL:
        {old_code}
        
        INSTRUCCION:
        Corrige el error. Asegúrate de que las importaciones y las variables de entorno se manejen bien.
        Responde SOLO con el código Python corregido, sin bloques de código markdown.
        """

        print("[PHOENIX] Generando parche de código...")
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        patch_code = response.text.replace("```python", "").replace("```", "").strip()

        # 4. Aplicar parche
        if len(patch_code) > 50:
            with open("main.py", "w") as f:
                f.write(patch_code)
            print("✅ PHOENIX: main.py actualizado. El orquestador lo reiniciará pronto.")
        else:
            print("❌ PHOENIX: Parche generado es demasiado corto o inválido.")

    except Exception as e:
        print(f"❌ PHOENIX CRITICAL: {e}")
        with open("logs/bot_runtime.log", "a") as f:
            f.write(f"\n[{time.strftime('%H:%M:%S')}] PHOENIX_FAIL: {traceback.format_exc()}")

if __name__ == "__main__":
    auto_reparar()

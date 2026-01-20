
import { Step, AlpacaConfig } from './types.ts';

export const TUTORIAL_STEPS: Step[] = [
  {
    id: 'requirements',
    title: 'Paso 1: Sentinel Core Deps (v43.0)',
    description: 'Lista maestra de dependencias. Incluye el nuevo SDK "google-genai" para evitar deprecaciones.',
    icon: 'fa-list-check',
    filename: 'requirements.txt',
    code: (_config: AlpacaConfig) => `requests
pandas
numpy
google-genai
colorama
pandas-ta`
  },
  {
    id: 'main_bot',
    title: 'Paso 2: Titan Bot v43.0 (Target)',
    description: 'Script principal de trading. Diseñado para fallar inicialmente y probar la auto-curación.',
    icon: 'fa-robot',
    filename: 'main.py',
    code: (config: AlpacaConfig) => `import requests, time, os
import pandas as pd
try:
    import pandas_ta as ta
except ImportError:
    ta = None
from colorama import Fore, Back, Style, init

init(autoreset=True)

# --- CONFIG v43.0 ---
API_KEY = "${config.apiKey}"
SECRET_KEY = "${config.secretKey}"
BASE_URL = "https://paper-api.alpaca.markets/v2"

def trading_logic():
    print(Fore.CYAN + "Scanning market for Sentinel signals...")
    # ERROR DE PRUEBA: 'sector_signal' no está definida. 
    # Esto activará el protocolo de reparación en el primer ciclo.
    print(f"Current Signal: {sector_signal}") 
    
if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if not os.path.exists("logs"): os.makedirs("logs")
    try:
        while True:
            trading_logic()
            time.sleep(10)
    except Exception as e:
        error_msg = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] CRITICAL: {str(e)}"
        with open("logs/bot_runtime.log", "a") as f:
            f.write(error_msg + "\\n")
        print(Fore.RED + error_msg)
        os._exit(1) # Salida con error para activar el reparador en el .bat
`
  },
  {
    id: 'gemini_fixer',
    title: 'Paso 3: Phoenix Brain (v43.0 Ultra)',
    description: 'Cerebro de reparación migrado al nuevo SDK "google-genai". Reconstruye main.py automáticamente.',
    icon: 'fa-brain-circuit',
    filename: 'gemini_fix.py',
    code: (_config: AlpacaConfig) => `from google import genai
import os, time

# API KEY PERMANENTE PARA PHOENIX PROTOCOL
API_KEY = "AIzaSyAyBLacc1t7JKZ5oVomVBPjnvps4xxjKtg"

def auto_reparar():
    print("\\n" + "="*50)
    print("--- PROTOCOLO PHOENIX v43.0: RECONSTRUCCIÓN ---")
    print("="*50)
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        client = genai.Client(api_key=API_KEY)
        
        if not os.path.exists("main.py"): 
            print("❌ Error: main.py no encontrado.")
            return
        
        with open("main.py", "r") as f:
            codigo_original = f.read()

        log_path = "logs/bot_runtime.log"
        error_context = "No log found"
        if os.path.exists(log_path):
            with open(log_path, "r") as f:
                lineas = f.readlines()
                error_context = "".join(lineas[-5:])

        prompt = f"""
        Actúa como Ingeniero Senior de Trading Algorítmico. 
        Mi bot de trading ha fallado con el siguiente error:
        {error_context}

        CÓDIGO ACTUAL:
        {codigo_original}
        
        INSTRUCCIÓN:
        Detecta el fallo (especialmente si faltan variables como 'sector_signal').
        Devuelve el código COMPLETO de main.py corregido.
        REGLAS:
        - Si falta 'sector_signal', inicialízala como 'NEUTRAL'.
        - No incluyas explicaciones.
        - No incluyas bloques de código Markdown (\`\`\`). Solo texto plano.
        """

        // Fix: Use gemini-3-flash-preview as recommended for basic/summarization tasks
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt
        )
        
        // Fix: Escaped backticks for safe template literal usage
        nuevo_codigo = response.text.replace("\`\`\`python", "").replace("\`\`\`", "").strip()

        if len(nuevo_codigo) > 100:
            with open("main.py", "w") as f:
                f.write(nuevo_codigo)
            print("✅ PHOENIX SUCCESS: main.py ha sido curado y optimizado.")
        else:
            print("❌ Error: La respuesta de la IA fue demasiado corta o inválida.")

    except Exception as e:
        print(f"❌ Fallo en Phoenix Brain: {e}")

if __name__ == "__main__":
    auto_reparar()`
  },
  {
    id: 'batch_runner',
    title: 'Paso 4: Orchestrator v43.0 (Anti-ModuleError)',
    description: 'Garantiza la instalación de módulos antes de cada ejecución. Recuperación total.',
    icon: 'fa-play',
    filename: 'run_bot.bat',
    code: (_config: AlpacaConfig) => `@echo off
cd /d "%~dp0"
title TITAN SENTINEL v43.0 - ULTRA RECOVERY
cls
echo [SYSTEM] Verificando entorno de ejecucion...

if not exist venv (
    echo [SYSTEM] Creando Entorno Virtual...
    python -m venv venv
)

call venv\\Scripts\\activate

:install_check
echo [SYSTEM] Verificando integridad de modulos...
python -c "import requests, google.genai, colorama, pandas" 2>nul
if %errorlevel% neq 0 (
    echo [ALERTA] Faltan modulos criticos. Instalando requisitos...
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    :: Instalacion especial para pandas-ta
    python -m pip install https://github.com/twopirllc/pandas-ta/archive/refs/heads/main.zip
)

:loop
cls
echo ==================================================
echo      TITAN PHOENIX v43.0 - ULTRA ROBUST
echo ==================================================
echo [STATUS] Iniciando %cd%\\main.py...
echo.

python main.py
if %errorlevel% neq 0 (
    echo.
    echo [FALLO] El bot ha colapsado.
    echo [PHOENIX] Iniciando auto-reparacion con Gemini 3...
    
    :: Aseguramos que gemini_fix tenga acceso a los modulos
    python gemini_fix.py
    
    echo [SYSTEM] Re-verificando integridad antes de reiniciar...
    goto install_check
)

echo [SYSTEM] Ciclo completado sin errores. Reiniciando en 60s...
timeout /t 60
goto loop`
  }
];

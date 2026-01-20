
import { Step, AlpacaConfig } from './types.ts';

export const TUTORIAL_STEPS: Step[] = [
  {
    id: 'requirements',
    title: 'Paso 1: Sentinel Core Deps (v51.2)',
    description: 'Dependencias críticas incluyendo librerías de IA y análisis técnico.',
    icon: 'fa-list-check',
    filename: 'requirements.txt',
    code: (_config: AlpacaConfig) => `requests
pandas>=2.2.0
numpy<2.0.0
google-genai
colorama
pandas-ta
python-dotenv`
  },
  {
    id: 'env_file',
    title: 'Paso 2: Vault Config',
    description: 'Archivo de configuración de entorno para secretos.',
    icon: 'fa-key',
    filename: '.env',
    code: (config: AlpacaConfig) => `ALPACA_API_KEY=${config.apiKey}
ALPACA_SECRET_KEY=${config.secretKey}
ALPACA_BASE_URL=https://paper-api.alpaca.markets/v2
# IMPORTANTE: Reemplaza con la llave de Gemini
GENAI_API_KEY=PON_TU_LLAVE_GEMINI_AQUI`
  },
  {
    id: 'run_script',
    title: 'Paso 3: Orchestrator v51.2',
    description: 'Script de ejecución con lógica de instalación redundante.',
    icon: 'fa-rocket',
    filename: 'run_bot.bat',
    code: (_config: AlpacaConfig) => `@echo off
title TITAN SENTINEL v51.2
cls
echo ==================================================
echo   TITAN SENTINEL v51.2: SISTEMA DE TRADING
echo ==================================================

:: 1. Verificación e instalación de dependencias
echo [%time%] Verificando dependencias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [%time%] Error en instalación estándar. Intentando fallback para pandas-ta...
    pip install git+https://github.com/twopirllc/pandas-ta.git
)

if not exist logs mkdir logs

:run_bot
echo [%time%] [SENTINEL] Iniciando motor principal (main.py)...
python main.py

if %errorlevel% neq 0 (
    echo [%time%] [CRITICAL] Fallo en main.py. Ejecutando PHOENIX RECOVERY...
    python gemini_fix.py
    
    if %errorlevel% neq 0 (
        echo.
        echo [!] ERROR CRITICO: El sistema de recuperación ha fallado.
        echo [!] Revisa tu archivo .env y asegúrate de que GENAI_API_KEY es válida.
        pause
        goto run_bot
    )

    echo [%time%] [PHOENIX] Reparación finalizada. Reiniciando en 10s...
    timeout /t 10 /nobreak > nul
    goto run_bot
)
pause`
  },
  {
    id: 'main_bot',
    title: 'Paso 4: Titan Bot v51.2 (Core Engine)',
    description: 'Bot principal con importaciones seguras y fallback para pandas-ta.',
    icon: 'fa-user-shield',
    filename: 'main.py',
    code: (_config: AlpacaConfig) => `import requests, time, os, traceback, sys, subprocess
import pandas as pd
import numpy as np
from colorama import Fore, init
from dotenv import load_dotenv

# Inicialización
init(autoreset=True)
load_dotenv()

# Manejo robusto de importaciones y fallback para pandas-ta
try:
    import pandas_ta as ta
except ImportError:
    print(Fore.YELLOW + "pandas-ta no encontrado. Iniciando instalación de emergencia desde GitHub...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "git+https://github.com/twopirllc/pandas-ta.git"])
        import pandas_ta as ta
        print(Fore.GREEN + "pandas-ta instalado y cargado con éxito.")
    except Exception as e:
        print(Fore.RED + f"Error fatal instalando pandas-ta: {e}")
        sys.exit(1)

# Importación del SDK de Google GenAI (google-genai)
try:
    from google import genai
except ImportError:
    print(Fore.RED + "Error: google-genai no instalado. Ejecuta 'pip install google-genai'")
    sys.exit(1)

API_KEY = os.getenv("ALPACA_API_KEY")
SECRET_KEY = os.getenv("ALPACA_SECRET_KEY")
BASE_URL = os.getenv("ALPACA_BASE_URL", "https://paper-api.alpaca.markets/v2")
GENAI_KEY = os.getenv("GENAI_API_KEY")

if not GENAI_KEY or "PON_TU_LLAVE" in GENAI_KEY:
    print(Fore.RED + "ERROR: GENAI_API_KEY faltante o inválida en el archivo .env.")
    sys.exit(1)

HEADERS = {"APCA-API-KEY-ID": API_KEY, "APCA-API-SECRET-KEY": SECRET_KEY}

def trading_logic():
    print(Fore.CYAN + f"[{time.strftime('%H:%M:%S')}] Analizando mercado...")
    # Ejemplo básico de uso de indicadores
    symbol = "AAPL"
    url = f"{BASE_URL.replace('/v2', '')}/data/v2/stocks/{symbol}/bars?timeframe=1Min&limit=100"
    resp = requests.get(url, headers=HEADERS)
    
    if resp.status_code == 200:
        bars = resp.json().get('bars', [])
        if not bars: return
        
        df = pd.DataFrame(bars)
        # Usando pandas-ta para el RSI
        df['rsi'] = ta.rsi(df['c'], length=14)
        last_rsi = df['rsi'].iloc[-1]
        
        print(Fore.WHITE + f"Símbolo: {symbol} | RSI: {last_rsi:.2f}")
        
        if last_rsi < 30:
            print(Fore.GREEN + ">>> SEÑAL DE COMPRA (OVERSOLD)")
        elif last_rsi > 70:
            print(Fore.RED + ">>> SEÑAL DE VENTA (OVERBOUGHT)")
    else:
        raise Exception(f"Fallo en Alpaca API: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    if not os.path.exists("logs"): os.makedirs("logs")
    print(Fore.YELLOW + "Titan Core v51.2: Sistema Iniciado.")
    try:
        while True:
            trading_logic()
            time.sleep(60)
    except Exception as e:
        error_msg = traceback.format_exc()
        with open("logs/bot_runtime.log", "a") as f:
            f.write(f"\\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] ERROR:\\n{error_msg}")
        print(Fore.RED + "Error crítico detectado. Phoenix intentará la reparación.")
        sys.exit(1)
`
  },
  {
    id: 'gemini_fixer',
    title: 'Paso 5: Phoenix Recovery (v51.2)',
    description: 'Cerebro reparador con carga segura de llaves e instrucciones claras.',
    icon: 'fa-shield-virus',
    filename: 'gemini_fix.py',
    code: (_config: AlpacaConfig) => `import os, sys, time, traceback
from dotenv import load_dotenv

# Carga de variables de entorno
load_dotenv()

def run_phoenix():
    print("\\n" + "="*50)
    print("   PHOENIX RECOVERY PROTOCOL v51.2 (SECURE)")
    print("="*50)
    
    API_KEY = os.getenv("GENAI_API_KEY")
    
    # Validación de la llave de Gemini
    if not API_KEY or "PON_TU_LLAVE" in API_KEY or len(API_KEY) < 20:
        print("\\n❌ ERROR: LLAVE DE API FALTANTE O INVALIDA.")
        print("-" * 50)
        print("COMO OBTENER UNA NUEVA LLAVE:")
        print("1. Entra a: https://aistudio.google.com/api-keys")
        print("2. Haz clic en 'Create API key'.")
        print("3. Copia la llave generada.")
        print("4. Abre tu archivo .env y pégala en GENAI_API_KEY=tu_llave")
        print("-" * 50)
        sys.exit(1)

    try:
        from google import genai
    except ImportError:
        print("❌ Error: google-genai no instalado. Reinstala requirements.txt")
        sys.exit(1)

    try:
        client = genai.Client(api_key=API_KEY)
        
        if not os.path.exists("main.py"):
            print("❌ Phoenix Error: No se encontró el archivo main.py")
            return

        with open("main.py", "r") as f:
            code = f.read()
        
        logs = "Log vacío"
        if os.path.exists("logs/bot_runtime.log"):
            with open("logs/bot_runtime.log", "r") as f:
                logs = "".join(f.readlines()[-30:])

        prompt = f"""
        SISTEMA DE AUTORREPARACION TITAN v51.2:
        Corrige el código de main.py basándote en los logs de error.
        Mantén las importaciones de pandas-ta y su lógica de instalación.
        
        LOGS DE ERROR:
        {logs}
        
        CODIGO ACTUAL:
        {code}
        
        Responde SOLO con el código Python completo corregido.
        """
        
        print("[PHOENIX] Consultando al mentor cuántico (Gemini 3 Pro)...")
        response = client.models.generate_content(
            model='gemini-3-pro-preview', 
            contents=prompt
        )
        
        new_code = response.text.replace("\`\`\`python", "").replace("\`\`\`", "").strip()
        
        if len(new_code) > 100:
            with open("main.py", "w") as f:
                f.write(new_code)
            print("✅ REPARACION EXITOSA: main.py ha sido actualizado.")
        else:
            print("❌ Phoenix Error: Respuesta de IA insuficiente.")
            
    except Exception as e:
        if "403" in str(e) or "permission" in str(e).lower():
            print("\\n❌ ERROR 403: La llave API ha sido rechazada o filtrada.")
            print("⚠️ Genera una nueva llave en Google AI Studio y actualiza tu .env")
        else:
            print(f"❌ FALLO EN PHOENIX: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_phoenix()`
  }
];

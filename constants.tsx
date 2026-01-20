
import { Step, AlpacaConfig } from './types.ts';

export const TUTORIAL_STEPS: Step[] = [
  {
    id: 'requirements',
    title: 'Paso 1: Sentinel Core Deps (v51.3)',
    description: 'Lista de dependencias críticas con soporte para IA y análisis técnico.',
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
    title: 'Paso 2: Vault Config (Dual-Key)',
    description: 'Archivo .env para la gestión segura de secretos y llaves de IA.',
    icon: 'fa-key',
    filename: '.env',
    code: (config: AlpacaConfig) => `ALPACA_API_KEY=${config.apiKey}
ALPACA_SECRET_KEY=${config.secretKey}
ALPACA_BASE_URL=https://paper-api.alpaca.markets/v2

# CONFIGURACIÓN DE IA (Requerido para Phoenix Recovery)
# Obtén tu llave en: https://aistudio.google.com/api-keys
GENAI_API_KEY=PON_TU_LLAVE_GEMINI_AQUI`
  },
  {
    id: 'run_script',
    title: 'Paso 3: Orchestrator v51.3',
    description: 'Script de arranque con lógica de instalación redundante para pandas-ta.',
    icon: 'fa-rocket',
    filename: 'run_bot.bat',
    code: (_config: AlpacaConfig) => `@echo off
title TITAN SENTINEL v51.3 - REDUNDANT MODE
cls
echo ==================================================
echo   TITAN SENTINEL v51.3: BOOTSTRAP PROTOCOL
echo ==================================================

:: 1. Instalación de dependencias con fallback
echo [%time%] Verificando integridad de librerias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [%time%] [WARNING] Instalacion estandar fallida.
    echo [%time%] [REDUNDANCY] Intentando instalar pandas-ta desde GitHub...
    pip install git+https://github.com/twopirllc/pandas-ta.git
)

if not exist logs mkdir logs

:run_bot
echo [%time%] [SENTINEL] Iniciando motor de trading...
python main.py

if %errorlevel% neq 0 (
    echo [%time%] [CRITICAL] Fallo detectado en el motor principal.
    echo [%time%] [PHOENIX] Activando protocolo de reparacion...
    python gemini_fix.py
    
    if %errorlevel% neq 0 (
        echo.
        echo [!] ERROR: El sistema no pudo autorrepararse.
        echo [!] Revisa tu configuracion de GENAI_API_KEY en .env
        pause
        goto run_bot
    )

    echo [%time%] [PHOENIX] Codigo reparado. Reiniciando en 10s...
    timeout /t 10 /nobreak > nul
    goto run_bot
)
pause`
  },
  {
    id: 'main_bot',
    title: 'Paso 4: Titan Bot v51.3 (Pro Core)',
    description: 'Bot principal con sistema de auto-importación y lógica de indicadores.',
    icon: 'fa-user-shield',
    filename: 'main.py',
    code: (_config: AlpacaConfig) => `import requests, time, os, traceback, sys, subprocess
import numpy as np
import pandas as pd
from colorama import Fore, init
from dotenv import load_dotenv

# Carga de entorno y color
init(autoreset=True)
load_dotenv()

# --- Sistema de Redundancia para Módulos Críticos ---
try:
    import pandas_ta as ta
except ImportError:
    print(Fore.YELLOW + "[!] pandas-ta no encontrado. Ejecutando instalacion de emergencia...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "git+https://github.com/twopirllc/pandas-ta.git"])
        import pandas_ta as ta
        print(Fore.GREEN + "[OK] pandas-ta instalado desde GitHub.")
    except Exception as e:
        print(Fore.RED + f"[FATAL] No se pudo instalar pandas-ta: {e}")
        sys.exit(1)

# Importación de SDK de Google GenAI
try:
    from google import genai
except ImportError:
    print(Fore.RED + "[!] google-genai no instalado. Revisa requirements.txt")
    sys.exit(1)

# Configuración de Secretos
API_KEY = os.getenv("ALPACA_API_KEY")
SECRET_KEY = os.getenv("ALPACA_SECRET_KEY")
BASE_URL = os.getenv("ALPACA_BASE_URL", "https://paper-api.alpaca.markets/v2")
GENAI_KEY = os.getenv("GENAI_API_KEY")

if not GENAI_KEY or "PON_TU_LLAVE" in GENAI_KEY:
    print(Fore.RED + "[ERROR] GENAI_API_KEY no detectada. Phoenix Recovery no funcionara.")

HEADERS = {"APCA-API-KEY-ID": API_KEY, "APCA-API-SECRET-KEY": SECRET_KEY}

def run_strategy():
    print(Fore.CYAN + f"[{time.strftime('%H:%M:%S')}] Escaneando mercado para AAPL...")
    url = f"{BASE_URL.replace('/v2', '')}/data/v2/stocks/AAPL/bars?timeframe=1Min&limit=100"
    resp = requests.get(url, headers=HEADERS)
    
    if resp.status_code == 200:
        bars = resp.json().get('bars', [])
        if not bars: return
        
        df = pd.DataFrame(bars)
        # Uso de pandas-ta para análisis técnico
        df['rsi'] = ta.rsi(df['c'], length=14)
        current_rsi = df['rsi'].iloc[-1]
        
        print(Fore.WHITE + f"RSI Actual: {current_rsi:.2f}")
        
        if current_rsi < 30:
            print(Fore.GREEN + ">>> SEÑAL: COMPRA (OVERSOLD)")
        elif current_rsi > 70:
            print(Fore.RED + ">>> SEÑAL: VENTA (OVERBOUGHT)")
    else:
        raise Exception(f"Fallo en API: {resp.status_code}")

if __name__ == "__main__":
    if not os.path.exists("logs"): os.makedirs("logs")
    print(Fore.CYAN + "=== TITAN CORE v51.3 ACTIVO ===")
    try:
        while True:
            run_strategy()
            time.sleep(60)
    except Exception as e:
        with open("logs/bot_runtime.log", "a") as f:
            f.write(f"\\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] ERROR:\\n{traceback.format_exc()}")
        print(Fore.RED + f"Fallo critico: {e}")
        sys.exit(1)
`
  },
  {
    id: 'gemini_fixer',
    title: 'Paso 5: Phoenix Recovery v51.3',
    description: 'Cerebro de reparación basado en Gemini 3 Pro con validación estricta de llaves.',
    icon: 'fa-shield-virus',
    filename: 'gemini_fix.py',
    code: (_config: AlpacaConfig) => `import os, sys, time, traceback
from dotenv import load_dotenv

# Carga segura de variables de entorno
load_dotenv()

def run_phoenix():
    print("\\n" + "="*60)
    print("   PHOENIX RECOVERY SYSTEM v51.3 - SECURITY PROTOCOL")
    print("="*60)
    
    API_KEY = os.getenv("GENAI_API_KEY")
    
    # --- Validación Estricta de la Llave ---
    if not API_KEY or "PON_TU_LLAVE" in API_KEY or len(API_KEY) < 20:
        print("\\n" + "!"*60)
        print("❌ ERROR: GENAI_API_KEY NO VALIDA O NO CONFIGURADA.")
        print("!"*60)
        print("\\nINSTRUCCIONES PARA REPARAR EL TERMINAL:")
        print("1. Dirigete a: https://aistudio.google.com/api-keys")
        print("2. Crea una 'API Key' gratuita (o de pago).")
        print("3. Abre el archivo .env de este bot.")
        print("4. Busca la linea: GENAI_API_KEY=...")
        print("5. Pega tu nueva llave alli y guarda el archivo.")
        print("\\n" + "="*60)
        sys.exit(1)

    try:
        from google import genai
    except ImportError:
        print("❌ Error: google-genai no instalado en el entorno Python.")
        sys.exit(1)

    try:
        # Inicialización del cliente con la llave del .env
        client = genai.Client(api_key=API_KEY)
        
        if not os.path.exists("main.py"):
            print("❌ Error: main.py no existe. No hay nada que reparar.")
            return

        with open("main.py", "r") as f:
            code = f.read()
        
        logs = "Sin logs disponibles."
        if os.path.exists("logs/bot_runtime.log"):
            with open("logs/bot_runtime.log", "r") as f:
                logs = "".join(f.readlines()[-40:])

        prompt = f"""
        SISTEMA DE AUTORREPARACION CUANTICA v51.3:
        Eres un experto en Python y Alpaca API.
        Tu mision es analizar los logs de error y corregir main.py.
        
        REQUISITOS DEL PARCHE:
        1. Mantener el sistema de auto-instalacion para pandas-ta.
        2. Corregir cualquier error de logica o de importacion detectado.
        
        LOGS DE ERROR:
        {logs}
        
        CODIGO FUENTE ACTUAL:
        {code}
        
        Responde exclusivamente con el codigo Python completo y funcional.
        """
        
        print("[PHOENIX] Conectando con Gemini 3 Pro para diagnostico...")
        # Uso de Gemini 3 Pro para tareas complejas de programacion
        response = client.models.generate_content(
            model='gemini-3-pro-preview', 
            contents=prompt
        )
        
        corrected_code = response.text.replace("\`\`\`python", "").replace("\`\`\`", "").strip()
        
        if len(corrected_code) > 100:
            with open("main.py", "w") as f:
                f.write(corrected_code)
            print("✅ EXITO: Parche aplicado. main.py ha sido reescrito y saneado.")
        else:
            print("❌ Fallo: La IA no pudo generar un parche valido.")
            
    except Exception as e:
        if "403" in str(e) or "permission" in str(e).lower():
            print("\\n❌ ERROR DE AUTORIZACION: Tu GENAI_API_KEY ha sido rechazada.")
            print("⚠️ Por favor, genera una llave nueva y actualiza el archivo .env.")
        else:
            print(f"❌ FALLO EN PHOENIX: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_phoenix()`
  }
];

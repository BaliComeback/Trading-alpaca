
import { Step, AlpacaConfig } from './types.ts';

export const TUTORIAL_STEPS: Step[] = [
  {
    id: 'requirements',
    title: 'Paso 1: Sentinel Core Deps (v46.0)',
    description: 'Asegúrate de tener instaladas todas las librerías de análisis técnico.',
    icon: 'fa-list-check',
    filename: 'requirements.txt',
    code: (_config: AlpacaConfig) => `requests
pandas>=2.2.0
numpy<2.0.0
google-genai
colorama
pandas-ta`
  },
  {
    id: 'main_bot',
    title: 'Paso 2: Titan Bot v46.0 (Alpha Trader)',
    description: 'Bot con estrategia RSI real. Analiza AAPL cada minuto.',
    icon: 'fa-chart-line',
    filename: 'main.py',
    code: (config: AlpacaConfig) => `import requests, time, os, traceback
import pandas as pd
import pandas_ta as ta
from google import genai
from colorama import Fore, init

init(autoreset=True)

# --- SENTINEL AI & ALPACA CONFIG v46.0 ---
API_KEY = "${config.apiKey}"
SECRET_KEY = "${config.secretKey}"
BASE_URL = "https://paper-api.alpaca.markets/v2"
GENAI_KEY = "AIzaSyAyBLacc1t7JKZ5oVomVBPjnvps4xxjKtg"

HEADERS = {
    "APCA-API-KEY-ID": API_KEY,
    "APCA-API-SECRET-KEY": SECRET_KEY
}

def get_crypto_data(symbol="AAPL"):
    # Obtenemos barras de 1 minuto para análisis rápido
    url = f"https://data.alpaca.markets/v2/stocks/{symbol}/bars?timeframe=1Min&limit=100"
    resp = requests.get(url, headers=HEADERS)
    if resp.status_code == 200:
        data = resp.json()
        df = pd.DataFrame(data['bars'])
        return df
    return None

def trading_logic():
    print(Fore.CYAN + "\\n--- ESCANEO DE MERCADO: AAPL ---")
    df = get_crypto_data("AAPL")
    
    if df is not None:
        # Calcular RSI usando pandas-ta
        df['RSI'] = ta.rsi(df['c'], length=14)
        current_rsi = df['RSI'].iloc[-1]
        
        print(f"Precio Actual: {df['c'].iloc[-1]}")
        print(f"RSI (14): {current_rsi:.2f}")

        if current_rsi < 35:
            sector_signal = "COMPRA (SOBREVENDIDO)"
            color = Fore.GREEN
        elif current_rsi > 65:
            sector_signal = "VENTA (SOBRECOMPRADO)"
            color = Fore.RED
        else:
            sector_signal = "NEUTRAL"
            color = Fore.YELLOW
            
        print(color + f"ESTADO DE SEÑAL: {sector_signal}")
    else:
        print(Fore.RED + "Error obteniendo datos de Alpaca. Revisa tus llaves.")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    if not os.path.exists("logs"): os.makedirs("logs")
    
    try:
        client = genai.Client(api_key=GENAI_KEY)
        print(Fore.GREEN + "Titan Alpha v46.0: ONLINE - Estrategia RSI Activa")
        
        while True:
            trading_logic()
            time.sleep(60) # Analizar cada minuto
    except Exception as e:
        full_error = traceback.format_exc()
        with open("logs/bot_runtime.log", "a") as f:
            f.write(f"\\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] ERROR:\\n{full_error}")
        print(Fore.RED + f"CRITICAL COLLAPSE: {e}")
        os._exit(1)
`
  },
  {
    id: 'gemini_fixer',
    title: 'Paso 3: Phoenix Brain (v46.0 Advanced)',
    description: 'Reparador optimizado para detectar fallos en la lógica de indicadores técnicos.',
    icon: 'fa-brain-circuit',
    filename: 'gemini_fix.py',
    code: (_config: AlpacaConfig) => `from google import genai
import os

API_KEY = "AIzaSyAyBLacc1t7JKZ5oVomVBPjnvps4xxjKtg"

def run_fix():
    print("--- PHOENIX v46.0: REPARANDO ESTRATEGIA ---")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    try:
        client = genai.Client(api_key=API_KEY)
        with open("main.py", "r") as f: code = f.read()
        
        log_content = ""
        if os.path.exists("logs/bot_runtime.log"):
            with open("logs/bot_runtime.log", "r") as f:
                log_content = "".join(f.readlines()[-30:])

        prompt = f"""
        ERROR EN ESTRATEGIA TRADING:
        {log_content}
        CÓDIGO:
        {code}
        INSTRUCCIÓN: Corrige el código de main.py para que funcione la estrategia RSI. 
        Asegúrate de importar pandas_ta correctamente.
        Devuelve SOLO el código limpio.
        """
        response = client.models.generate_content(model='gemini-3-flash-preview', contents=prompt)
        new_code = response.text.replace("\`\`\`python", "").replace("\`\`\`", "").strip()
        with open("main.py", "w") as f: f.write(new_code)
        print("✅ Estrategia restaurada.")
    except Exception as e: print(f"Error: {e}")

if __name__ == "__main__": run_fix()`
  }
];

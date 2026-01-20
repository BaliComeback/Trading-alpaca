
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout.tsx';
import { AppTab, AlpacaConfig } from './types.ts';
import { TUTORIAL_STEPS } from './constants.tsx';
import MentorChat from './components/MentorChat.tsx';

// Define the global window interface extension to include aistudio.
// Using an inline type for aistudio avoids naming collisions with existing 'AIStudio' interfaces in the global namespace.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }
}

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'SYSTEM' | 'SECURITY' | 'PHOENIX' | 'KEY';
  message: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GUIDE);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  const [config] = useState<AlpacaConfig>({ 
    apiKey: 'PKABBE46FEEGTE5GX63RZ5QHZX', 
    secretKey: 'G3VbQLwvM4QXjYyhC8XpfpFknpeBucwvNujURftgFC9a', 
    isPaper: true 
  });

  const addLog = useCallback((type: TerminalLog['type'], message: string) => {
    const newLog: TerminalLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setTerminalLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  const checkKeyStatus = async () => {
    setIsCheckingKey(true);
    try {
      // Correctly check if aistudio interface exists before usage.
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeyValid(hasKey);
        if (hasKey) {
          addLog('KEY', "Llave Gemini verificada. Acceso concedido.");
        } else {
          addLog('SECURITY', "Acceso denegado: Se requiere autorización de API Key.");
        }
      } else {
        // Handle case where aistudio is missing.
        setIsKeyValid(false);
        addLog('SECURITY', "Acceso denegado: Interface de autorización no encontrada.");
      }
    } catch (e) {
      console.error("Error comprobando llave:", e);
    } finally {
      setIsCheckingKey(false);
    }
  };

  const handleAuthorize = async () => {
    // Open the key selection dialog as per guidelines if available.
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Guideline: Assume successful selection after triggering the dialog to avoid race conditions.
      setIsKeyValid(true);
      addLog('SYSTEM', "Iniciando re-sincronización de bóveda...");
    }
  };

  useEffect(() => {
    checkKeyStatus();
    addLog('SYSTEM', "Titan Sentinel v51.0: Cargando protocolos de seguridad.");
  }, []);

  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-mono text-xs tracking-widest uppercase animate-pulse">Checking Vault Integrity...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-8 pb-24 text-slate-100">
        
        {/* KEY MANAGEMENT HEADER */}
        <div className={`p-6 rounded-3xl border transition-all duration-500 ${isKeyValid ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-900/10' : 'bg-rose-500/10 border-rose-500/30 shadow-rose-900/10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-colors ${isKeyValid ? 'bg-emerald-600' : 'bg-rose-600 animate-pulse'}`}>
                <i className={`fas ${isKeyValid ? 'fa-check-double' : 'fa-key-skeleton'}`}></i>
              </div>
              <div>
                <h2 className={`text-xl font-black uppercase tracking-tighter italic ${isKeyValid ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {isKeyValid ? 'Terminal Secure' : 'Terminal Locked'}
                </h2>
                <p className="text-slate-400 text-sm max-w-md">
                  {isKeyValid 
                    ? 'La conexión con Gemini API es estable. Todos los archivos del bot están sincronizados.' 
                    : 'Error 403 detectado. Tu llave anterior ha sido revocada por filtración. Autoriza una nueva.'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleAuthorize}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isKeyValid ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-rose-600 hover:bg-rose-500 text-white animate-bounce'}`}
            >
              <i className="fas fa-plug mr-3"></i>
              {isKeyValid ? 'Cambiar Llave' : 'Vincular Nueva Llave'}
            </button>
          </div>
          {!isKeyValid && (
            <div className="mt-4 pt-4 border-t border-rose-500/20 text-center">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-rose-400/60 uppercase font-bold hover:text-rose-400 transition-colors">
                Nota: Debes seleccionar una llave de un proyecto con facturación (Google Cloud) <i className="fas fa-external-link-alt ml-1"></i>
              </a>
            </div>
          )}
        </div>

        {isKeyValid ? (
          <>
            {activeTab === AppTab.GUIDE && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="lg:col-span-2 space-y-8">
                  {TUTORIAL_STEPS.map(step => (
                    <div key={step.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group transition-all hover:border-cyan-500/30">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                        <div className="flex items-center space-x-5">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                            <i className={`fas ${step.icon}`}></i>
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{step.title}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{step.filename}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const blob = new Blob([step.code(config)], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = step.filename; a.click();
                            addLog('SYSTEM', `Descargado: ${step.filename}`);
                          }}
                          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
                        >
                          DOWNLOAD
                        </button>
                      </div>
                      <div className="bg-slate-950 p-6 text-[10px] font-mono text-slate-400 overflow-x-auto">
                        <pre><code>{step.code(config)}</code></pre>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <div className="p-4 border-b border-slate-800 flex justify-between bg-slate-900/40">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500 italic">Security Logs</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1">
                      {terminalLogs.map((log) => (
                        <div key={log.id} className={`flex gap-2 border-l-2 pl-3 py-1 ${log.type === 'KEY' ? 'border-emerald-500' : 'border-slate-800'}`}>
                          <span className={`
                            ${log.type === 'KEY' ? 'text-emerald-400' : ''} 
                            ${log.type === 'SECURITY' ? 'text-rose-400' : ''} 
                            ${log.type === 'SYSTEM' ? 'text-slate-500' : ''} 
                          `}>
                            [{log.timestamp}] {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === AppTab.MENTOR && <div className="max-w-4xl mx-auto"><MentorChat /></div>}
          </>
        ) : (
          <div className="bg-slate-900/50 rounded-3xl p-20 text-center border border-slate-800/50 border-dashed">
            <i className="fas fa-lock text-slate-800 text-8xl mb-6"></i>
            <h3 className="text-2xl font-black text-slate-600 uppercase italic">Contenido Bloqueado</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
              Por favor, autoriza una nueva API Key de Gemini en la parte superior para habilitar el mentor y el generador de código.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;

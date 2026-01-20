
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './components/Layout.tsx';
import { AppTab, AlpacaConfig } from './types.ts';
import { TUTORIAL_STEPS } from './constants.tsx';
import MentorChat from './components/MentorChat.tsx';

interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'SYSTEM' | 'PHOENIX' | 'INTEGRITY' | 'FIXED';
  message: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GUIDE);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  
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

  useEffect(() => {
    addLog('SYSTEM', "Quantum Sentinel v43.0: Ultra-Robust Mode.");
    addLog('INTEGRITY', "Verificacion de modulos integrada en el arranque.");
    addLog('PHOENIX', "Recuperacion circular Gemini 2.0 Flash activa.");
  }, [addLog]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto space-y-8 pb-24 text-slate-100">
        {activeTab === AppTab.GUIDE && (
          <>
            <section className="bg-slate-900 border-l-8 border-rose-500 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fas fa-user-shield text-[12rem] text-rose-500"></i>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-rose-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    ULTRA ROBUST v43.0
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    MODULE FIX ENABLED
                  </span>
                </div>
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                  Titan <span className="text-rose-500">Sentinel</span>
                </h1>
                <p className="text-slate-400 max-w-xl font-medium text-sm leading-relaxed">
                  He detectado los errores <span className="text-rose-400 font-bold">ModuleNotFoundError</span>. La nueva v43.0 verifica que todas las librerías estén instaladas antes de cada ciclo, garantizando que el reparador de IA siempre tenga lo que necesita para trabajar.
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                 {TUTORIAL_STEPS.map(step => (
                    <div key={step.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group transition-all">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
                        <div className="flex items-center space-x-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg bg-slate-950 border border-slate-800 ${step.id.includes('batch') ? 'text-rose-500' : 'text-slate-400'}`}>
                            <i className={`fas ${step.icon}`}></i>
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{step.title}</h3>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const blob = new Blob([step.code(config)], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = step.filename; a.click();
                          }}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
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
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">Sentinel Integrity Logs</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1">
                      {terminalLogs.map((log) => (
                        <div key={log.id} className={`flex gap-2 border-l-2 pl-3 py-1 ${log.type === 'INTEGRITY' ? 'border-emerald-500' : 'border-slate-800'}`}>
                          <span className={`
                            ${log.type === 'INTEGRITY' ? 'text-emerald-400 font-bold' : ''} 
                            ${log.type === 'PHOENIX' ? 'text-rose-400 font-bold' : ''} 
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
          </>
        )}
        {activeTab === AppTab.MENTOR && <div className="max-w-4xl mx-auto"><MentorChat /></div>}
      </div>
    </Layout>
  );
};

export default App;

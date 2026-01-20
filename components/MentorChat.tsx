import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getTradingAdvice } from '../services/geminiService.ts';

const MentorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '¡Bienvenido al módulo de Day Trading Avanzado! 🚀\n\nHe configurado mi sistema para ayudarte a construir un bot que analice el mercado minuto a minuto. Para reducir el margen de error, debemos hablar de:\n\n1. **Indicadores Técnicos** (RSI, MACD).\n2. **Stop Loss** (Para que un error no te cueste la cuenta).\n3. **Backtesting** (Probar tu idea en el pasado).\n\n¿Qué activo te gustaría que analizáramos primero?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getTradingAdvice([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 flex flex-col h-[600px] overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <i className="fas fa-microchip text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Day Trading Mentor</h3>
            <p className="text-xs text-cyan-400 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
              Modo Análisis Activo
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' 
              : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 p-3 rounded-2xl rounded-tl-none border border-slate-600">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu duda sobre Day Trading..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all transform active:scale-95 shadow-lg"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorChat;
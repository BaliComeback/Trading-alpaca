
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-600 to-emerald-600 p-2 rounded-xl shadow-lg shadow-cyan-900/20">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight uppercase italic leading-none">Titan <span className="text-cyan-400">Terminal</span></h1>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Alpaca Algo Engine</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 bg-slate-900/50 border border-slate-800 p-1 rounded-2xl">
            {[
              { id: AppTab.GUIDE, label: 'Control', icon: 'fa-terminal' },
              { id: AppTab.MENTOR, label: 'Mentor', icon: 'fa-brain' },
              { id: AppTab.RESOURCES, label: 'Docs', icon: 'fa-book' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl transition-all duration-300 group ${
                  activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <i className={`fas ${tab.icon} text-[10px] ${activeTab === tab.id ? 'text-cyan-400' : ''}`}></i>
                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 md:px-8">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Titan Algorithmic Trading Systems © 2024</p>
            <p className="text-[10px] text-slate-700 font-medium">Professional Grade Execution Interface</p>
          </div>
          <div className="flex items-center gap-4 bg-rose-500/5 border border-rose-500/10 px-6 py-3 rounded-2xl">
            <i className="fas fa-exclamation-triangle text-rose-500/60 text-xs"></i>
            <p className="text-[10px] text-rose-500/70 font-black uppercase tracking-widest italic">
              Risk Notice: Trading involves loss. Use Paper Accounts for testing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

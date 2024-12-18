import React from 'react';
import { Bot, Wrench } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function ModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div className={`flex items-center rounded-lg p-1 ${
      mode === 'builder' 
        ? 'bg-black border border-blue-400/30' 
        : 'bg-slate-100 dark:bg-slate-800'
    }`}>
      <button
        onClick={() => setMode('workforce')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
          mode === 'workforce'
            ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
        }`}
      >
        <Bot className="w-4 h-4" />
        <span className="text-sm font-medium">AI Workforce</span>
      </button>
      <button
        onClick={() => setMode('builder')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
          mode === 'builder'
            ? 'bg-black shadow-neon-blue border border-blue-400 text-blue-400 text-glow-blue'
            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span className="text-sm font-medium">Assistant Builder</span>
      </button>
    </div>
  );
}
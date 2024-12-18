import React from 'react';
import { MessagesSquare } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function EmptyChat() {
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className={`p-4 rounded-full mb-4 ${
        isBuilder 
          ? 'bg-blue-400/10' 
          : 'bg-slate-100 dark:bg-slate-800'
      }`}>
        <MessagesSquare className={`w-8 h-8 ${
          isBuilder 
            ? 'text-blue-400' 
            : 'text-slate-400 dark:text-slate-500'
        }`} />
      </div>
      <h3 className={`text-lg font-medium mb-2 ${
        isBuilder 
          ? 'text-blue-400' 
          : 'text-slate-900 dark:text-slate-100'
      }`}>
        No Chat Selected
      </h3>
      <p className={`text-center max-w-md ${
        isBuilder 
          ? 'text-blue-400/70' 
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        Select a thread from the sidebar to start chatting, or create a new conversation to begin.
      </p>
    </div>
  );
}
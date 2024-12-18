import React from 'react';
import { ChevronRight, Files } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import AssistantFiles from './files/AssistantFiles';

interface RightPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedAssistant?: string | null;
}

export default function RightPanel({ isOpen, onToggle, selectedAssistant }: RightPanelProps) {
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  if (!isBuilder) return null;

  return (
    <div className="h-full flex flex-col bg-black border-l border-green-400/30">
      <div className="p-4 border-b border-green-400/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Files className="w-5 h-5 text-green-400" />
          <h2 className="text-green-400 font-medium">Assistant Files</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-green-400/20 rounded-lg transition-colors"
        >
          <ChevronRight className={`w-5 h-5 text-green-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <AssistantFiles selectedAssistant={selectedAssistant} />
      </div>
    </div>
  );
}
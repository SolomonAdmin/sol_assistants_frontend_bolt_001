import React from 'react';
import { Menu, ChevronLeft, Files, Settings } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import WorkspaceSelector from '../WorkspaceSelector';
import AssistantSelector from '../AssistantSelector';
import ModeToggle from '../ModeToggle';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  selectedAssistant: string | null;
  setSelectedAssistant: (id: string) => void;
}

export default function ChatHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  isRightPanelOpen,
  setIsRightPanelOpen,
  setIsSettingsOpen,
  selectedAssistant,
  setSelectedAssistant
}: ChatHeaderProps) {
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  return (
    <div className={`border-b px-4 py-2 flex items-center justify-between nav-blur ${
      isBuilder
        ? 'bg-black/80 border-green-400/30'
        : 'glass-panel border-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800/80'
    }`} style={{ zIndex: 40 }}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg transition-all duration-300 group ${
            isBuilder
              ? 'hover:bg-green-400/20 text-green-400'
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300'
          }`}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
        <ModeToggle />
        <WorkspaceSelector />
        <AssistantSelector 
          selectedAssistant={selectedAssistant}
          onAssistantSelect={setSelectedAssistant}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        {isBuilder && (
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-green-400/20 text-green-400"
          >
            <Files className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isBuilder
              ? 'hover:bg-green-400/20 text-green-400'
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
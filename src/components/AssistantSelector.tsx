import React, { useState, useEffect, useRef } from 'react';
import { Bot, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { AssistantService } from '../services/AssistantService';

interface AssistantSelectorProps {
  selectedAssistant: string | null;
  onAssistantSelect: (assistantId: string) => void;
}

export default function AssistantSelector({ selectedAssistant, onAssistantSelect }: AssistantSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assistants, setAssistants] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, solomonConsumerKey } = useAuth();
  const { mode } = useMode();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAssistants = async () => {
      if (!accessToken || !solomonConsumerKey) return;

      setIsLoading(true);
      try {
        const assistantService = new AssistantService(accessToken, solomonConsumerKey);
        const assistantList = await assistantService.getAssistants(mode);
        setAssistants(assistantList);
      } catch (error) {
        console.error('Error fetching assistants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistants();
  }, [accessToken, solomonConsumerKey, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const MenuItem = ({ icon: Icon, label, onClick, isSelected }: { icon: any; label: string; onClick?: () => void; isSelected?: boolean }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors ${
        isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${
          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
        }`} />
        <span className={`text-sm ${
          isSelected ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
        }`}>{label}</span>
      </div>
      {isSelected && (
        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      )}
    </button>
  );

  const selectedAssistantName = assistants.find(a => a.id === selectedAssistant)?.name;

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center space-x-2 px-3 py-1.5">
        <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ zIndex: 50 }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          selectedAssistant 
            ? mode === 'builder'
              ? 'bg-black border-2 border-blue-400/30 text-blue-400 hover:border-blue-400/50'
              : 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Bot className={`w-5 h-5 ${
          selectedAssistant 
            ? mode === 'builder'
              ? 'text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 dark:text-slate-400'
        }`} />
        <span className={`text-sm font-medium ${
          selectedAssistant 
            ? mode === 'builder'
              ? 'text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-700 dark:text-slate-300'
        }`}>
          {selectedAssistantName || 'Select Assistant'}
        </span>
        <ChevronDown className={`w-4 h-4 ${
          selectedAssistant 
            ? mode === 'builder'
              ? 'text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-400'
        } transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{ 
            position: 'fixed',
            top: buttonRef.current?.getBoundingClientRect().bottom ?? 0,
            left: buttonRef.current?.getBoundingClientRect().left ?? 0,
            zIndex: 9999 
          }}
          className={`w-64 rounded-lg shadow-lg py-1 ${
            mode === 'builder'
              ? 'bg-black border border-blue-400/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {assistants.map((assistant) => (
            <MenuItem
              key={assistant.id}
              icon={Bot}
              label={assistant.name}
              isSelected={assistant.id === selectedAssistant}
              onClick={() => {
                onAssistantSelect(assistant.id);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
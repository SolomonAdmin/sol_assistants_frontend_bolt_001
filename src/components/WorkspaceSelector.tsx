import React, { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WorkspaceService } from '../services/WorkspaceService';

export default function WorkspaceSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, currentWorkspace, setWorkspace } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        const workspaceService = new WorkspaceService(accessToken);
        const workspaceNames = await workspaceService.getWorkspaces();
        setWorkspaces(workspaceNames);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [accessToken]);

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

  const MenuItem = ({ label, onClick, isSelected }: { label: string; onClick?: () => void; isSelected?: boolean }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors ${
        isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Building2 className={`w-5 h-5 ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
        }`} />
        <span className={`text-sm ${
          isSelected ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
        }`}>{label}</span>
      </div>
      {isSelected && (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      )}
    </button>
  );

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
          currentWorkspace 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Building2 className={`w-5 h-5 ${
          currentWorkspace 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-slate-500 dark:text-slate-400'
        }`} />
        <span className={`text-sm font-medium ${
          currentWorkspace 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-slate-700 dark:text-slate-300'
        }`}>
          {currentWorkspace || 'Select Workspace'}
        </span>
        <ChevronDown className={`w-4 h-4 ${
          currentWorkspace 
            ? 'text-emerald-600 dark:text-emerald-400' 
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
          className="w-64 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1"
        >
          {workspaces.map((workspace) => (
            <MenuItem
              key={workspace}
              label={workspace}
              isSelected={workspace === currentWorkspace}
              onClick={() => {
                setWorkspace(workspace);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
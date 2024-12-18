import React from 'react';
import { X, Monitor, Moon, Sun, Volume2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Theme changes are automatically saved via the ThemeContext
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Chat Settings</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Appearance</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'light'
                    ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-600 dark:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                } border`}
              >
                <Sun className={`w-5 h-5 ${
                  theme === 'light' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`} />
                <span className={`text-sm ${
                  theme === 'light'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-600 dark:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                } border`}
              >
                <Moon className={`w-5 h-5 ${
                  theme === 'dark'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`} />
                <span className={`text-sm ${
                  theme === 'dark'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-3 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  theme === 'system'
                    ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-600 dark:border-blue-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                } border`}
              >
                <Monitor className={`w-5 h-5 ${
                  theme === 'system'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`} />
                <span className={`text-sm ${
                  theme === 'system'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>System</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Sound</h4>
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <input
                type="range"
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Chat Display</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-slate-600 dark:text-slate-400">Show timestamps</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-slate-600 dark:text-slate-400">Show read receipts</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
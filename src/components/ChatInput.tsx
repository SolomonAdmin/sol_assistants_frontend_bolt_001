import React, { useState, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useMode } from '../context/ModeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isDisabled: boolean;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  isDisabled, 
  isLoading,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [textareaHeight, setTextareaHeight] = useState('80px');
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = '80px';
    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim() || isDisabled || isLoading) return;
    
    try {
      setMessage('');
      await onSendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(message);
    }
  }, [message, isDisabled, isLoading, onSendMessage]);

  return (
    <div className={`p-4 backdrop-blur-sm border-t ${
      isBuilder
        ? 'bg-black/50 border-blue-400/30'
        : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-700/50'
    }`}>
      <div className={`rounded-2xl p-4 ${
        isBuilder
          ? 'bg-black/80 border border-blue-400/30 shadow-neon-blue'
          : 'glass-panel luxury-shadow dark:shadow-luxury-dark bg-white/80 dark:bg-slate-800/80'
      }`}>
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isDisabled || isLoading}
              style={{ height: textareaHeight }}
              className={`w-full resize-none rounded-xl p-3 pr-12 transition-all duration-300 disabled:cursor-not-allowed ${
                isBuilder
                  ? 'bg-black border-2 border-blue-400/30 text-blue-400 placeholder-blue-400/50 focus:ring-2 focus:ring-blue-400/50 focus:border-transparent disabled:bg-black/50'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500'
              }`}
            />
            {isLoading && (
              <div className="absolute right-3 bottom-3">
                <Loader2 className={`w-5 h-5 animate-spin ${
                  isBuilder ? 'text-blue-400' : 'text-blue-500 dark:text-blue-400'
                }`} />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={isDisabled || !message.trim() || isLoading}
            className={`p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg transition-all duration-300 ${
              isBuilder
                ? 'bg-black border-2 border-blue-400 text-blue-400 hover:shadow-neon-blue disabled:border-blue-400/30 disabled:text-blue-400/30'
                : 'btn-luxury bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700'
            }`}
          >
            <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
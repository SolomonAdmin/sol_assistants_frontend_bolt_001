import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { AssistantService, Thread } from '../services/AssistantService';
import { BuilderThreadService, BuilderThread } from '../services/BuilderThreadService';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onThreadSelect?: (threadId: string, threadName?: string) => void;
  selectedThread?: string;
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  onThreadSelect,
  selectedThread 
}: SidebarProps) {
  const [threads, setThreads] = useState<(Thread | BuilderThread)[]>([]);
  const [threadSearch, setThreadSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, solomonConsumerKey } = useAuth();
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  useEffect(() => {
    const fetchThreads = async () => {
      if (!accessToken || !solomonConsumerKey) {
        setThreads([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        if (isBuilder) {
          // Fetch builder threads
          const builderService = new BuilderThreadService(accessToken, solomonConsumerKey);
          const builderThreads = await builderService.getBuilderThreads();
          setThreads(builderThreads);
        } else {
          // Fetch regular threads
          const assistantService = new AssistantService(accessToken, solomonConsumerKey);
          const regularThreads = await assistantService.getThreads();
          setThreads(regularThreads);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
        setThreads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [accessToken, solomonConsumerKey, isBuilder]);

  const filteredThreads = threads.filter(thread =>
    (thread.thread_name || `Thread ${thread.thread_id.slice(0, 8)}...`)
      .toLowerCase()
      .includes(threadSearch.toLowerCase())
  );

  const LoadingState = () => (
    <div className="p-4">
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-lg ${
              isBuilder ? 'bg-blue-400/20' : 'bg-slate-200 dark:bg-slate-700'
            }`}></div>
            <div className={`h-4 rounded flex-1 ${
              isBuilder ? 'bg-blue-400/20' : 'bg-slate-200 dark:bg-slate-700'
            }`}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col ${
      isBuilder
        ? 'bg-black border-r border-blue-400/30'
        : 'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50'
    }`}>
      <div className={`p-4 border-b ${
        isBuilder ? 'border-blue-400/30' : 'border-slate-200 dark:border-slate-700/50'
      }`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isBuilder ? 'text-blue-400/70' : 'text-slate-400 dark:text-slate-500'
          }`} />
          <input
            type="text"
            value={threadSearch}
            onChange={(e) => setThreadSearch(e.target.value)}
            placeholder="Search threads..."
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg focus:ring-2 focus:border-transparent ${
              isBuilder
                ? 'bg-black border-2 border-blue-400/30 text-blue-400 placeholder-blue-400/50 focus:ring-blue-400/50'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100'
            }`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="p-2 space-y-1">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const displayName = thread.thread_name || `Thread ${thread.thread_id.slice(0, 8)}...`;
                const fullName = thread.thread_name || `Thread ${thread.thread_id}`;
                
                return (
                  <div key={thread.thread_id} className="group relative">
                    <button
                      onClick={() => onThreadSelect?.(thread.thread_id, thread.thread_name)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedThread === thread.thread_id
                          ? isBuilder
                            ? 'bg-blue-400/20 text-blue-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                          : isBuilder
                            ? 'hover:bg-blue-400/10 text-blue-400/70'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <MessageCircle className={`w-4 h-4 ${
                        selectedThread === thread.thread_id
                          ? isBuilder
                            ? 'text-blue-400'
                            : 'text-blue-600 dark:text-blue-400'
                          : isBuilder
                            ? 'text-blue-400/50'
                            : 'text-slate-400 dark:text-slate-500'
                      }`} />
                      <span className="text-sm truncate flex-1 text-left">
                        {displayName}
                      </span>
                    </button>
                    
                    <div className={`absolute left-0 -top-2 w-auto p-2 min-w-max transform -translate-y-full
                                  rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                  pointer-events-none z-50 ${
                                    isBuilder
                                      ? 'bg-black border border-blue-400/30 text-blue-400'
                                      : 'bg-gray-900 dark:bg-gray-800 text-white'
                                  }`}>
                      {fullName}
                      <div className={`absolute bottom-0 left-6 transform translate-y-1/2 rotate-45
                                    w-2 h-2 ${
                                      isBuilder
                                        ? 'bg-black border-r border-b border-blue-400/30'
                                        : 'bg-gray-900 dark:bg-gray-800'
                                    }`}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-4">
                <p className={`text-sm ${
                  isBuilder ? 'text-blue-400/70' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {threadSearch ? `No threads found matching "${threadSearch}"` : 'No threads available'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
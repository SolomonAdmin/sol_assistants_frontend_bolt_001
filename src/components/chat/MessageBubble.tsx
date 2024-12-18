import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  msg: {
    role: string;
    value: string;
    created_at: number;
    assistant_id?: string;
    assistant_name?: string;
  };
  isBuilder: boolean;
}

export default function MessageBubble({ msg, isBuilder }: MessageBubbleProps) {
  const isUser = msg.role === 'user';
  const displayName = msg.assistant_name || 'Assistant';

  return (
    <div className={`flex items-start space-x-3 message-appear ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform ${
          isBuilder
            ? 'bg-black border-2 border-green-400 text-green-400 shadow-neon-green'
            : 'bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white'
        }`}>
          <span className="text-sm font-medium">AI</span>
        </div>
      )}
      <div className={`flex-1 max-w-2xl ${isUser ? 'text-right' : ''}`}>
        {!isUser && (
          <span className={`text-sm mb-1 block ${
            isBuilder ? 'text-green-400' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {displayName}
          </span>
        )}
        <div className={`message-bubble p-4 rounded-2xl ${
          isBuilder
            ? isUser
              ? 'bg-black border-2 border-green-400 text-green-400 shadow-neon-green'
              : 'bg-black border border-green-400/50 text-green-400'
            : isUser
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
        }`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className={`prose prose-sm max-w-none whitespace-pre-wrap ${
              isBuilder ? 'prose-green' : 'dark:prose-invert'
            }`}
            components={{
              p: ({ children }) => <p className="m-0">{children}</p>,
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                >
                  {children}
                </a>
              ),
              code: ({ inline, children }) => {
                if (inline) {
                  return (
                    <code className={`px-1 py-0.5 rounded text-sm ${
                      isBuilder
                        ? 'bg-black border border-green-400/30 text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className={`p-3 rounded-lg overflow-x-auto ${
                    isBuilder
                      ? 'bg-black border border-green-400/30'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <code>{children}</code>
                  </pre>
                );
              },
              ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
              li: ({ children }) => <li className="my-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 pl-3 my-2 italic ${
                  isBuilder
                    ? 'border-green-400/30'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {children}
                </blockquote>
              ),
            }}
          >
            {msg.value}
          </ReactMarkdown>
        </div>
        <span className={`text-xs mt-1 block ${
          isBuilder ? 'text-green-400/70' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {new Date(msg.created_at * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      {isUser && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform ${
          isBuilder
            ? 'bg-black border-2 border-green-400 text-green-400'
            : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300'
        }`}>
          <span className="text-sm font-medium">You</span>
        </div>
      )}
    </div>
  );
}
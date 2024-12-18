import React from 'react';
import { useMode } from '../../context/ModeContext';
import ChatInput from '../ChatInput';
import EmptyChat from '../EmptyChat';
import MessageBubble from './MessageBubble';

interface ChatPanelProps {
  selectedThread: string | null;
  selectedAssistant: string | null;
  messages: any[];
  error: string | null;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatPanel({
  selectedThread,
  selectedAssistant,
  messages,
  error,
  isLoading,
  messagesEndRef,
  onSendMessage
}: ChatPanelProps) {
  const { mode } = useMode();
  const isBuilder = mode === 'builder';

  return (
    <div className={`h-full flex flex-col ${
      isBuilder ? 'bg-black' : 'chat-container dark:bg-slate-900'
    }`}>
      {selectedThread ? (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="max-w-4xl mx-auto px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400">
                {error}
              </div>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {messages.map((msg, index) => (
                <MessageBubble key={`${msg.created_at}-${index}`} msg={msg} isBuilder={isBuilder} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-4">
            <ChatInput
              onSendMessage={onSendMessage}
              isDisabled={!selectedAssistant || !selectedThread}
              isLoading={isLoading}
              placeholder={
                !selectedAssistant
                  ? "Please select an assistant..."
                  : !selectedThread
                  ? "Please select a thread..."
                  : "Type your message..."
              }
            />
          </div>
        </>
      ) : (
        <EmptyChat />
      )}
    </div>
  );
}
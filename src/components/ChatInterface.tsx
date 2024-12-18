import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMode } from '../context/ModeContext';
import { AssistantService } from '../services/AssistantService';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatPanel from './chat/ChatPanel';
import ChatHeader from './chat/ChatHeader';
import RightPanel from './RightPanel';
import SettingsModal from './SettingsModal';

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [selectedThreadName, setSelectedThreadName] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, accessToken, solomonConsumerKey } = useAuth();
  const { mode } = useMode();
  const navigate = useNavigate();
  const isBuilder = mode === 'builder';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Add new useEffect to fetch messages when selectedThread changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedThread || !accessToken || !solomonConsumerKey) {
        setMessages([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const assistantService = new AssistantService(accessToken, solomonConsumerKey);
        const threadMessages = await assistantService.getThreadMessages(selectedThread);
        setMessages(threadMessages);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
        setError(errorMessage);
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedThread, accessToken, solomonConsumerKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleThreadSelect = (threadId: string, threadName?: string) => {
    setSelectedThread(threadId);
    setSelectedThreadName(threadName || null);
    setError(null);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedThread || !selectedAssistant || !accessToken || !solomonConsumerKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const assistantService = new AssistantService(accessToken, solomonConsumerKey);
      
      await assistantService.addMessageToThread(selectedThread, message);
      const updatedMessages = await assistantService.runThreadAndListMessages(
        selectedThread,
        selectedAssistant
      );

      if (updatedMessages) {
        setMessages(updatedMessages);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`h-screen flex flex-col ${isBuilder ? 'bg-black' : 'bg-slate-50 dark:bg-slate-900'}`}>
      <Navbar showAuthButtons={true} />
      
      <div className="flex-1 flex flex-col min-h-0">
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isRightPanelOpen={isRightPanelOpen}
          setIsRightPanelOpen={setIsRightPanelOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          selectedAssistant={selectedAssistant}
          setSelectedAssistant={setSelectedAssistant}
        />

        <div className="flex-1 min-h-0">
          <PanelGroup direction="horizontal">
            {isSidebarOpen && (
              <>
                <Panel defaultSize={20} minSize={15} maxSize={40}>
                  <Sidebar 
                    isOpen={isSidebarOpen} 
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    onThreadSelect={handleThreadSelect}
                    selectedThread={selectedThread}
                  />
                </Panel>
                <PanelResizeHandle className="w-1 hover:bg-green-400 transition-colors" />
              </>
            )}
            
            <Panel>
              <ChatPanel 
                selectedThread={selectedThread}
                selectedAssistant={selectedAssistant}
                messages={messages}
                error={error}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                onSendMessage={handleSendMessage}
              />
            </Panel>

            {isRightPanelOpen && isBuilder && (
              <>
                <PanelResizeHandle className="w-1 hover:bg-green-400 transition-colors" />
                <Panel defaultSize={25} minSize={20} maxSize={40}>
                  <RightPanel 
                    isOpen={isRightPanelOpen}
                    onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
                    selectedAssistant={selectedAssistant}
                  />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
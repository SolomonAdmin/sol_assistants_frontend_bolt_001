import React, { useState, useEffect, useRef } from 'react';
import { Database, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { VectorStore, VectorStoreService } from '../../services/VectorStoreService';
import { AssistantService } from '../../services/AssistantService';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VectorStoreSelectorProps {
  selectedStore: string | null;
  selectedAssistant: string | null;
  onStoreSelect: (storeId: string) => void;
}

export default function VectorStoreSelector({ 
  selectedStore, 
  selectedAssistant,
  onStoreSelect 
}: VectorStoreSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState<VectorStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, solomonConsumerKey } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStores = async () => {
      if (!selectedAssistant || !accessToken || !solomonConsumerKey) {
        setStores([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // First get the assistant details to get vector store IDs
        const assistantService = new AssistantService(accessToken, solomonConsumerKey);
        const response = await fetch(
          `${assistantService.baseUrl}/assistant/${selectedAssistant}`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'solomon-consumer-key': solomonConsumerKey
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch assistant details');
        }

        const assistantDetails = await response.json();
        const vectorStoreIds = assistantDetails.tool_resources?.file_search?.vector_store_ids || [];

        if (vectorStoreIds.length === 0) {
          setStores([]);
          return;
        }

        // Then fetch all vector stores and filter by the IDs
        const vectorStoreService = new VectorStoreService(solomonConsumerKey);
        const allStores = await vectorStoreService.listVectorStores();
        const filteredStores = allStores.filter(store => 
          vectorStoreIds.includes(store.id)
        );
        
        setStores(filteredStores);
      } catch (error) {
        console.error('Error fetching vector stores:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch vector stores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [selectedAssistant, accessToken, solomonConsumerKey]);

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

  if (!selectedAssistant) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-400/70">Select an assistant to view available vector stores</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 p-4 bg-red-400/10 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-400/70">No vector stores available for this assistant</p>
      </div>
    );
  }

  const selectedStoreName = stores.find(s => s.id === selectedStore)?.name || 'Select Vector Store';

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
          selectedStore 
            ? 'bg-green-400/10 border border-green-400/40 text-green-400'
            : 'border border-green-400/20 text-green-400/70 hover:border-green-400/40'
        }`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            selectedStore ? 'bg-green-400/10' : 'bg-green-400/5'
          }`}>
            <Database className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium truncate">
            {selectedStoreName}
          </span>
        </div>
        <ChevronDown className="flex-shrink-0 w-4 h-4 ml-2 transition-transform duration-200" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full max-h-[300px] overflow-y-auto bg-black border border-green-400/20 rounded-lg shadow-lg py-1 scrollbar-custom"
          >
            {stores.map((store, index) => (
              <motion.button
                key={store.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => {
                  onStoreSelect(store.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-green-400/5 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`flex-shrink-0 p-1.5 rounded-lg ${
                    store.id === selectedStore ? 'bg-green-400/10' : 'bg-green-400/5'
                  }`}>
                    <Database className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm text-green-400 font-medium truncate">
                      {store.name || 'Unnamed Store'}
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-green-400/40">
                        {(store.usage_bytes / 1024).toFixed(1)} KB
                      </span>
                      <span className="text-green-400/40">•</span>
                      <span className="text-xs text-green-400/40">
                        {store.file_counts.total} files
                      </span>
                    </div>
                  </div>
                </div>
                {store.id === selectedStore && (
                  <Check className="flex-shrink-0 w-4 h-4 text-green-400 ml-3" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Database } from 'lucide-react';
import { VectorStoreFile, VectorStoreService } from '../../services/VectorStoreService';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VectorStoreFilesProps {
  storeId: string;
}

export default function VectorStoreFiles({ storeId }: VectorStoreFilesProps) {
  const [files, setFiles] = useState<VectorStoreFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { solomonConsumerKey } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!solomonConsumerKey || !storeId) return;
      setIsLoading(true);

      try {
        const service = new VectorStoreService(solomonConsumerKey);
        const storeFiles = await service.listVectorStoreFiles(storeId);
        setFiles(storeFiles);
      } catch (error) {
        console.error('Error fetching vector store files:', error);
        setFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [solomonConsumerKey, storeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-6 text-center"
      >
        <Database className="w-8 h-8 text-green-400/40 mb-3" />
        <p className="text-green-400/50 text-sm">
          No files in this vector store
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 py-2">
        <span className="text-green-400/70 text-xs font-medium">
          Store Files ({files.length})
        </span>
        <span className="text-green-400/70 text-xs">
          {(files.reduce((acc, file) => acc + file.usage_bytes, 0) / 1024).toFixed(1)} KB total
        </span>
      </div>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-custom">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center space-x-3 p-3 bg-black border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
            >
              <div className="p-2 bg-green-400/5 rounded-lg group-hover:bg-green-400/10 transition-colors">
                <FileText className="w-4 h-4 text-green-400 flex-shrink-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm font-medium truncate">
                    {file.id.split('-')[1]}
                  </span>
                  <span className="text-green-400/40 text-xs ml-2">
                    {(file.usage_bytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-green-400/40 text-xs">
                    {new Date(file.created_at * 1000).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    file.status === 'completed'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {file.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
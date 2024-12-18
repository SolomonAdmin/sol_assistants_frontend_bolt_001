import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import FileUploadSection from './FileUploadSection';
import { FileState, FileUploadState } from './types';
import { FileUploadService } from '../../services/FileUploadService';
import { useAuth } from '../../context/AuthContext';

interface AssistantFilesProps {
  selectedAssistant?: string | null;
}

export default function AssistantFiles({ selectedAssistant }: AssistantFilesProps) {
  const [files, setFiles] = useState<FileUploadState>({
    search: [],
    interpreter: []
  });
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'interpreter'>('search');
  const { solomonConsumerKey } = useAuth();

  const handleFilesAdded = (type: 'search' | 'interpreter') => async (newFiles: File[]) => {
    if (!solomonConsumerKey) return;

    const fileUploadService = new FileUploadService(solomonConsumerKey);
    
    const newFileStates: FileState[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadStatus: 'pending'
    }));

    setFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...newFileStates]
    }));

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const fileState = newFileStates[i];

      try {
        setFiles(prev => ({
          ...prev,
          [type]: prev[type].map(f => 
            f.id === fileState.id 
              ? { ...f, uploadStatus: 'uploading' }
              : f
          )
        }));

        const response = await fileUploadService.uploadFile(file);

        setFiles(prev => ({
          ...prev,
          [type]: prev[type].map(f => 
            f.id === fileState.id 
              ? { ...f, uploadStatus: 'completed', fileId: response.id }
              : f
          )
        }));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        
        setFiles(prev => ({
          ...prev,
          [type]: prev[type].map(f => 
            f.id === fileState.id 
              ? { ...f, uploadStatus: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          )
        }));
      }
    }
  };

  const handleFileRemove = (type: 'search' | 'interpreter') => (fileId: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: prev[type].filter(file => file.id !== fileId)
    }));
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'search' | 'interpreter')}>
        <TabsList>
          <TabsTrigger value="search">File Search</TabsTrigger>
          <TabsTrigger value="interpreter">Code Interpreter</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <FileUploadSection
            type="search"
            files={files.search}
            selectedStore={selectedStore}
            selectedAssistant={selectedAssistant}
            onStoreSelect={handleStoreSelect}
            onFilesAdded={handleFilesAdded('search')}
            onFileRemove={handleFileRemove('search')}
          />
        </TabsContent>

        <TabsContent value="interpreter">
          <FileUploadSection
            type="interpreter"
            files={files.interpreter}
            selectedStore={null}
            selectedAssistant={selectedAssistant}
            onStoreSelect={() => {}}
            onFilesAdded={handleFilesAdded('interpreter')}
            onFileRemove={handleFileRemove('interpreter')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
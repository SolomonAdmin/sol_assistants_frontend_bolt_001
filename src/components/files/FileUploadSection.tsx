import React, { useState } from 'react';
import { Upload, FileText, Code, AlertCircle, Loader2 } from 'lucide-react';
import FileList from './FileList';
import VectorStoreSelector from './VectorStoreSelector';
import VectorStoreFiles from './VectorStoreFiles';
import AssistantFileDetails from './AssistantFileDetails';
import { FileState } from './types';
import { FileUploadService } from '../../services/FileUploadService';
import { AssistantService } from '../../services/AssistantService';
import { useAuth } from '../../context/AuthContext';

interface FileUploadSectionProps {
  type: 'search' | 'interpreter';
  files: FileState[];
  selectedStore: string | null;
  selectedAssistant?: string | null;
  onStoreSelect: (storeId: string) => void;
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
}

export default function FileUploadSection({ 
  type, 
  files, 
  selectedStore,
  selectedAssistant,
  onStoreSelect,
  onFilesAdded, 
  onFileRemove 
}: FileUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { accessToken, solomonConsumerKey } = useAuth();
  
  const isSearch = type === 'search';
  const title = isSearch ? 'File Search' : 'Code Interpreter';
  const icon = isSearch ? FileText : Code;
  const acceptedFiles = isSearch 
    ? '.pdf,.doc,.docx,.txt,.csv,.xlsx'
    : '.py,.js,.jsx,.ts,.tsx,.json,.yaml,.yml,.html,.css';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-green-400');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-green-400');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-green-400');
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      await handleFiles(droppedFiles);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      await handleFiles(selectedFiles);
      e.target.value = '';
    }
  };

  const handleFiles = async (selectedFiles: File[]) => {
    if (!solomonConsumerKey || !accessToken || !selectedAssistant) {
      setUploadError('Missing required credentials or no assistant selected');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileUploadService = new FileUploadService(solomonConsumerKey);
      const assistantService = new AssistantService(accessToken, solomonConsumerKey);

      for (const file of selectedFiles) {
        // First upload the file
        const uploadResponse = await fileUploadService.uploadFile(file);
        console.log('File uploaded successfully:', uploadResponse);

        // Then modify the assistant with the new file ID
        const modifyResponse = await assistantService.modifyAssistant(
          selectedAssistant,
          uploadResponse.id
        );
        console.log('Assistant modified successfully:', modifyResponse);

        // Update the UI with the new file
        onFilesAdded([file]);
      }
    } catch (error) {
      console.error('Error handling files:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to process files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {React.createElement(icon, { 
              className: 'w-5 h-5 text-green-400'
            })}
            <h3 className="text-lg font-medium text-green-400">
              {title}
            </h3>
          </div>
          {files.length > 0 && (
            <span className="text-sm text-green-400/70">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {isSearch && (
          <>
            <VectorStoreSelector
              selectedStore={selectedStore}
              selectedAssistant={selectedAssistant}
              onStoreSelect={onStoreSelect}
            />
            {selectedStore && (
              <VectorStoreFiles storeId={selectedStore} />
            )}
          </>
        )}

        {!isSearch && <AssistantFileDetails selectedAssistant={selectedAssistant} />}
      </div>

      {uploadError && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative border-2 border-dashed border-green-400/30 rounded-xl p-8 transition-all hover:border-green-400/50"
      >
        <input
          type="file"
          multiple
          accept={acceptedFiles}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading || !selectedAssistant}
        />
        <div className="flex flex-col items-center justify-center text-center space-y-4 pointer-events-none">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              <p className="text-green-400 font-medium">Uploading files...</p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-green-400/10 rounded-full">
                <Upload className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-medium">
                  {selectedAssistant 
                    ? 'Drop files here or click to upload'
                    : 'Please select an assistant first'}
                </p>
                <p className="text-green-400/70 text-sm mt-1">
                  {isSearch 
                    ? 'Upload documents for the assistant to search through'
                    : 'Upload code files for the assistant to analyze and execute'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <FileList files={files} onRemove={onFileRemove} />
      )}

      {files.length > 10 && (
        <div className="flex items-center space-x-2 text-amber-400 bg-amber-400/10 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">
            Large number of files may impact assistant performance
          </p>
        </div>
      )}
    </div>
  );
}
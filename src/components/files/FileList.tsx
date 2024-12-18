import React from 'react';
import { X, FileText, Code, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { FileType } from './types';

interface FileState extends FileType {
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
  error?: string;
}

interface FileListProps {
  files: FileState[];
  onRemove: (fileId: string) => void;
}

export default function FileList({ files, onRemove }: FileListProps) {
  const getFileIcon = (type: string) => {
    if (type.includes('code')) return Code;
    if (type.includes('text')) return FileText;
    return File;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-green-400 animate-spin" />;
      default:
        return <Loader2 className="w-4 h-4 text-green-400/50" />;
    }
  };

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-custom">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-black border border-green-400/30 rounded-lg group hover:border-green-400/50 transition-all"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {React.createElement(getFileIcon(file.type), {
              className: 'w-4 h-4 text-green-400 flex-shrink-0'
            })}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-sm truncate">
                  {file.name}
                </span>
                {getStatusIcon(file.uploadStatus)}
              </div>
              {file.error && (
                <span className="text-red-400 text-xs">
                  {file.error}
                </span>
              )}
            </div>
            <span className="text-green-400/50 text-xs whitespace-nowrap">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            onClick={() => onRemove(file.id)}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-green-400/20 transition-all ml-2"
          >
            <X className="w-4 h-4 text-green-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
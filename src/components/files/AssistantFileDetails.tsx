import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { AssistantService } from '../../services/AssistantService';
import { useAuth } from '../../context/AuthContext';

interface AssistantFileDetailsProps {
  selectedAssistant: string | null;
}

interface AssistantDetails {
  id: string;
  name: string;
  tool_resources?: {
    code_interpreter?: {
      file_ids: string[];
    };
    file_search?: {
      file_ids: string[] | null;
      vector_store_ids: string[];
    };
  };
}

interface FileDetails {
  id: string;
  filename: string;
  bytes: number;
  created_at: number;
}

export default function AssistantFileDetails({ selectedAssistant }: AssistantFileDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantDetails, setAssistantDetails] = useState<AssistantDetails | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails[]>([]);
  const { accessToken, solomonConsumerKey } = useAuth();

  useEffect(() => {
    const fetchAssistantDetails = async () => {
      if (!selectedAssistant || !accessToken || !solomonConsumerKey) {
        setAssistantDetails(null);
        setFileDetails([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const assistantService = new AssistantService(accessToken, solomonConsumerKey);
        
        // Fetch assistant details
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

        const details: AssistantDetails = await response.json();
        setAssistantDetails(details);

        // Fetch file details if there are code interpreter files
        const fileIds = details.tool_resources?.code_interpreter?.file_ids || [];
        if (fileIds.length > 0) {
          const fileDetailsPromises = fileIds.map(async (fileId) => {
            const fileResponse = await fetch(
              `${assistantService.baseUrl}/files/${fileId}`,
              {
                headers: {
                  'accept': 'application/json',
                  'solomon-consumer-key': solomonConsumerKey
                }
              }
            );

            if (!fileResponse.ok) {
              throw new Error(`Failed to fetch file details for ${fileId}`);
            }

            return fileResponse.json();
          });

          const files = await Promise.all(fileDetailsPromises);
          setFileDetails(files);
        }
      } catch (error) {
        console.error('Error fetching assistant details:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch assistant details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistantDetails();
  }, [selectedAssistant, accessToken, solomonConsumerKey]);

  if (!selectedAssistant) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-400/70">Select an assistant to view file details</p>
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

  if (!assistantDetails) {
    return (
      <div className="p-4 text-center">
        <p className="text-green-400/70">No assistant details available</p>
      </div>
    );
  }

  const hasCodeInterpreterFiles = fileDetails.length > 0;

  return (
    <div className="space-y-4 p-4">
      <div className="border border-green-400/30 rounded-lg p-4 bg-black">
        <h3 className="text-green-400 font-medium mb-2">
          {assistantDetails.name}
        </h3>
        
        {hasCodeInterpreterFiles ? (
          <div className="space-y-3">
            <p className="text-green-400/70 text-sm">
              Code Interpreter Files:
            </p>
            {fileDetails.map((file) => (
              <div 
                key={file.id}
                className="flex items-center space-x-3 p-3 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-colors"
              >
                <FileText className="w-4 h-4 text-green-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-400 text-sm truncate">
                    {file.filename}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-green-400/50 text-xs">
                      {(file.bytes / 1024).toFixed(1)} KB
                    </span>
                    <span className="text-green-400/50">•</span>
                    <span className="text-green-400/50 text-xs">
                      {new Date(file.created_at * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-400/70 text-sm">
            No code interpreter files attached
          </p>
        )}
      </div>
    </div>
  );
}
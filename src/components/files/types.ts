export interface FileType {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface FileState extends FileType {
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
  fileId?: string;
  error?: string;
}

export interface FileUploadState {
  search: FileState[];
  interpreter: FileState[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
}
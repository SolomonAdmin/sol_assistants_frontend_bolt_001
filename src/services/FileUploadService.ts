export interface FileUploadResponse {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}

export class FileUploadService {
  private baseUrl = "https://55gdlc2st8.execute-api.us-east-1.amazonaws.com/api/v2";

  constructor(private solomonConsumerKey: string) {}

  private getHeaders(includeContentType: boolean = true) {
    const headers: Record<string, string> = {
      "accept": "application/json",
      "solomon-consumer-key": this.solomonConsumerKey
    };

    if (includeContentType) {
      headers["Content-Type"] = "multipart/form-data";
    }

    return headers;
  }

  async uploadFile(file: File, purpose: 'assistants' = 'assistants'): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', purpose);

      const response = await fetch(`${this.baseUrl}/files/upload`, {
        method: 'POST',
        headers: this.getHeaders(false), // Let browser set content-type with boundary
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
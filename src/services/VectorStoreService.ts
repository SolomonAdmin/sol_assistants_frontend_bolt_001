export interface VectorStore {
  id: string;
  name: string;
  created_at: number;
  usage_bytes: number;
  status: string;
  file_counts: {
    in_progress: number;
    completed: number;
    failed: number;
    cancelled: number;
    total: number;
  };
}

export interface VectorStoreFile {
  id: string;
  object: string;
  created_at: number;
  usage_bytes: number;
  vector_store_id: string;
  status: string;
  last_error: string | null;
}

export interface VectorStoreResponse {
  object: string;
  data: VectorStore[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

export interface VectorStoreFilesResponse {
  object: string;
  data: VectorStoreFile[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

export class VectorStoreService {
  private baseUrl = "https://55gdlc2st8.execute-api.us-east-1.amazonaws.com/api/v2";

  constructor(private solomonConsumerKey: string) {}

  private getHeaders() {
    return {
      "accept": "application/json",
      "solomon-consumer-key": this.solomonConsumerKey
    };
  }

  async listVectorStores(limit: number = 20, order: string = 'desc'): Promise<VectorStore[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString(), order });
      const response = await fetch(
        `${this.baseUrl}/vector_stores/list_vector_stores?${params}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VectorStoreResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching vector stores:', error);
      throw error;
    }
  }

  async listVectorStoreFiles(storeId: string, limit: number = 20, order: string = 'desc'): Promise<VectorStoreFile[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString(), order });
      const response = await fetch(
        `${this.baseUrl}/vector_stores/list_vector_store_files/${storeId}/files?${params}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VectorStoreFilesResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching vector store files:', error);
      throw error;
    }
  }
}
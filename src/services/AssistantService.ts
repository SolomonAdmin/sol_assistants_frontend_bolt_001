import { BaseService } from './BaseService';

export interface Assistant {
  id: string;
  name: string;
  metadata?: {
    type?: string;
  };
}

export interface Thread {
  thread_id: string;
  thread_name?: string;
}

export interface Message {
  role: string;
  value: string;
  created_at: number;
  assistant_id?: string;
  assistant_name?: string;
}

export interface AssistantTools {
  type: 'code_interpreter' | 'retrieval' | 'file_search';
}

export interface AssistantToolResources {
  code_interpreter?: {
    file_ids: string[];
  };
  file_search?: {
    file_ids: string[] | null;
    vector_store_ids: string[];
  };
}

export class AssistantService extends BaseService {
  private assistantNames: Record<string, string> = {};

  async getAssistants(mode: 'workforce' | 'builder', order: string = 'desc', limit: number = 100): Promise<Assistant[]> {
    try {
      const params = new URLSearchParams({ order, limit: limit.toString() });
      const url = `${this.baseUrl}/assistant/list_assistants?${params}`;
      
      const data = await this.fetchWithRetry<any>(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const assistants = data.data || [];
      
      // Filter based on mode
      const filteredAssistants = mode === 'builder' 
        ? assistants.filter(assistant => assistant.name === 'Assistant Builder')
        : assistants;
      
      this.assistantNames = filteredAssistants.reduce((acc: Record<string, string>, assistant: Assistant) => {
        acc[assistant.id] = assistant.name;
        return acc;
      }, {});

      return filteredAssistants;
    } catch (error) {
      console.error('Error fetching assistants:', error);
      throw error;
    }
  }

  async getThreads(): Promise<Thread[]> {
    try {
      if (!this.solomonConsumerKey) {
        throw new Error('Missing consumer key');
      }

      const url = `${this.baseUrl}/thread/threads/${this.solomonConsumerKey}`;
      const data = await this.fetchWithRetry<any>(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return data.threads || [];
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }
  }

  async modifyAssistant(
    assistantId: string,
    fileId: string,
    name?: string
  ): Promise<any> {
    try {
      if (!assistantId) {
        throw new Error('Assistant ID is required');
      }

      const payload = {
        name: name || undefined,
        tools: [
          { type: "file_search" },
          { type: "code_interpreter" }
        ],
        tool_resources: {
          code_interpreter: {
            file_ids: [fileId]
          },
          file_search: {
            file_ids: null,
            vector_store_ids: []
          }
        }
      };

      return await this.fetchWithRetry(
        `${this.baseUrl}/assistant/modify_assistant/${assistantId}`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        }
      );
    } catch (error) {
      console.error('Error modifying assistant:', error);
      throw error;
    }
  }

  async addMessageToThread(threadId: string, content: string): Promise<any> {
    try {
      if (!threadId || !content) {
        throw new Error('Thread ID and content are required');
      }

      return await this.fetchWithRetry(
        `${this.baseUrl}/messages/create_message/threads/${threadId}/messages`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            role: 'user',
            content: content
          })
        }
      );
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getThreadMessages(threadId: string, limit: number = 25, order: string = 'asc'): Promise<Message[]> {
    try {
      if (!threadId) {
        throw new Error('Thread ID is required');
      }

      const params = new URLSearchParams({ limit: limit.toString(), order });
      const data = await this.fetchWithRetry<any>(
        `${this.baseUrl}/messages/list_messages/threads/${threadId}/messages?${params}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      return this.parseMessages(data);
    } catch (error) {
      console.error('Error fetching thread messages:', error);
      throw error;
    }
  }

  async runThreadAndListMessages(threadId: string, assistantId: string): Promise<Message[] | null> {
    if (!threadId || !assistantId) {
      throw new Error('Thread ID and Assistant ID are required');
    }

    try {
      const result = await this.fetchWithRetry<any>(
        `${this.baseUrl}/runs/run_thread_and_list_messages`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            thread_id: threadId,
            assistant_id: assistantId
          })
        }
      );

      return this.parseMessages(result);
    } catch (error) {
      console.error('Error running thread:', error);
      throw error;
    }
  }

  private parseMessages(responseData: any): Message[] {
    const messages = Array.isArray(responseData) ? responseData : responseData.data || [];
    
    return messages.map((message: any) => ({
      role: message.role || 'unknown',
      value: message.content?.[0]?.text?.value || '',
      created_at: message.created_at || 0,
      assistant_id: message.assistant_id,
      assistant_name: message.assistant_id ? this.getAssistantName(message.assistant_id) : undefined
    })).sort((a, b) => a.created_at - b.created_at);
  }

  getAssistantName(assistantId: string): string {
    return this.assistantNames[assistantId] || assistantId;
  }

  updateConsumerKey(newKey: string) {
    this.solomonConsumerKey = newKey;
  }
}
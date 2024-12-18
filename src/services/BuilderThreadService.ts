import { BaseService } from './BaseService';

export interface BuilderThread {
  thread_id: string;
  thread_name?: string;
}

export class BuilderThreadService extends BaseService {
  async getBuilderThreads(): Promise<BuilderThread[]> {
    try {
      if (!this.solomonConsumerKey) {
        throw new Error('Missing consumer key');
      }

      const url = `${this.baseUrl}/assistant-builder-thread/threads/${this.solomonConsumerKey}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch builder threads');
      }

      const data = await response.json();
      return data.threads || [];
    } catch (error) {
      console.error('Error fetching builder threads:', error);
      throw error;
    }
  }
}
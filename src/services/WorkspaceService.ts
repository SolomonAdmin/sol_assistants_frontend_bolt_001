import { BaseService } from './BaseService';

export interface Workspace {
  name: string;
}

export class WorkspaceService extends BaseService {
  async getWorkspaces(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch workspaces');
      }

      const data = await response.json();
      return data.workspace_names || [];
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw error;
    }
  }

  async getWorkspaceKey(workspaceName: string): Promise<string | null> {
    if (!workspaceName) {
      throw new Error('Workspace name is required');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/workspace-key/${encodeURIComponent(workspaceName)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch workspace key');
      }

      const data = await response.json();
      return data.solomon_consumer_key || null;
    } catch (error) {
      console.error('Error fetching workspace key:', error);
      throw error;
    }
  }
}
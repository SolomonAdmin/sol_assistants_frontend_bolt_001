import { BaseService } from './BaseService';

interface SignInResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface UserInfo {
  id: string;
  email: string;
  name?: string;
}

export class AuthService extends BaseService {
  async signIn(email: string, password: string): Promise<SignInResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Invalid credentials');
      }

      const data = await response.json();
      if (!data.access_token) {
        throw new Error('Invalid response from server');
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign in';
      throw new Error(message);
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Unable to retrieve user information');
    }
  }

  async getConsumerKey(accessToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/consumer-key`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch consumer key');
      }

      const data = await response.json();
      return data.solomon_consumer_key;
    } catch (error) {
      throw new Error('Unable to retrieve consumer key');
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Logout request failed, but proceeding with local logout');
      }
    } catch (error) {
      console.warn('Logout request failed, but proceeding with local logout');
    }
  }
}
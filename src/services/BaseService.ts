export class BaseService {
  protected baseUrl = "https://55gdlc2st8.execute-api.us-east-1.amazonaws.com/api/v2";

  constructor(
    protected accessToken?: string,
    protected solomonConsumerKey?: string
  ) {}

  protected getHeaders(includeAuth: boolean = true) {
    const headers: Record<string, string> = {
      "accept": "application/json",
      "Content-Type": "application/json"
    };

    if (includeAuth) {
      if (!this.accessToken || !this.solomonConsumerKey) {
        throw new Error('Missing required credentials');
      }

      headers["Authorization"] = `Bearer ${this.accessToken}`;
      headers["solomon-consumer-key"] = this.solomonConsumerKey;
    }

    return headers;
  }

  protected async handleResponse(response: Response) {
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage;
      
      try {
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
        } else {
          errorMessage = await response.text() || `HTTP error! status: ${response.status}`;
        }
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    }
    
    return await response.text();
  }

  protected async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        return await this.handleResponse(response);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');
        if (i === retries - 1) break;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}
// src/services/api/client.ts

/**
 * A basic API client for making HTTP requests.
 * This structure can be extended to include more advanced features
 * like authentication, error handling, and request/response interceptors.
 */
// src/services/api/client.ts

/**
 * A basic API client for making HTTP requests.
 * This structure can be extended to include more advanced features
 * like authentication, error handling, and request/response interceptors.
 */

// Placeholder for authentication token retrieval
function getAuthToken(): string | null {
  // In a real application, this would retrieve the token from a user session,
  // localStorage, or a global state management store.
  return localStorage.getItem('authToken');
}

// Basic in-memory circuit breaker
const circuitBreaker = {
  failures: 0,
  timeout: 0,
  isTripped: false,
  failureThreshold: 5,
  resetTime: 60 * 1000, // 1 minute

  trip() {
    this.isTripped = true;
    this.failures = 0;
    this.timeout = Date.now() + this.resetTime;
    console.warn(`Circuit breaker tripped! Blocking requests until ${new Date(this.timeout).toLocaleTimeString()}`);
  },

  reset() {
    this.isTripped = false;
    this.failures = 0;
    this.timeout = 0;
    console.info('Circuit breaker reset.');
  },

  recordFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.trip();
    }
  },

  allowRequest() {
    if (!this.isTripped) {
      return true;
    }
    if (Date.now() > this.timeout) {
      console.warn('Circuit breaker in half-open state. Allowing one request to test service.');
      this.isTripped = false; // Half-open state
      return true;
    }
    return false;
  }
};

class ApiClient {
  private baseUrl: string;
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(baseUrl: string, maxRetries: number = 3, retryDelayMs: number = 1000) {
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    retries: number = 0
  ): Promise<T> {
    if (!circuitBreaker.allowRequest()) {
      throw new Error('Circuit breaker is open. Service is currently unavailable.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const requestId = crypto.randomUUID(); // Generate a unique request ID

    let headers = new Headers(options?.headers);

    // Authentication Interceptor
    const authToken = getAuthToken();
    if (authToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    };

    // Log outgoing request
    console.log(`[${requestId}] Request: ${requestOptions.method || 'GET'} ${url}`);
    console.log(`[${requestId}] Headers: ${JSON.stringify(Object.fromEntries(headers.entries()))}`);
    if (requestOptions.body) {
      console.log(`[${requestId}] Body: ${requestOptions.body.toString().substring(0, 200)}...`); // Log first 200 chars
    }

    const startTime = Date.now();
    try {
      const response = await fetch(url, requestOptions);
      const duration = Date.now() - startTime;

      // Log incoming response
      console.log(`[${requestId}] Response: ${response.status} ${response.statusText} (${duration}ms)`);
      const responseBody = await response.clone().text(); // Clone response to read body without consuming it
      console.log(`[${requestId}] Response Body: ${responseBody.substring(0, 200)}...`); // Log first 200 chars

      if (!response.ok) {
        circuitBreaker.recordFailure();

        // Handle 401 Unauthorized - placeholder for token refresh
        if (response.status === 401) {
          console.warn(`[${requestId}] 401 Unauthorized. Token might be expired. (Future: initiate token refresh)`);
          // In a real app, you'd trigger a token refresh flow here
          // For now, re-throw to indicate failure
        }

        // Robust Error Handling: Retry with exponential backoff for transient errors
        if (response.status >= 500 && retries < this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, retries);
          console.warn(`[${requestId}] Retrying request (attempt ${retries + 1}/${this.maxRetries}) after ${delay}ms due to ${response.status} error.`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retries + 1);
        }

        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`API Error [${requestId}]: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      circuitBreaker.reset();
      return response.json() as Promise<T>;
    } catch (error: any) {
      circuitBreaker.recordFailure();
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] Request failed (${duration}ms): ${error.message}`);

      // Retry for network errors (e.g., TypeError when fetch fails)
      if (retries < this.maxRetries && (error instanceof TypeError || error.message.includes('Failed to fetch'))) {
        const delay = this.retryDelayMs * Math.pow(2, retries);
        console.warn(`[${requestId}] Retrying request (attempt ${retries + 1}/${this.maxRetries}) after ${delay}ms due to network error.`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retries + 1);
      }

      throw new Error(`Network Error [${requestId}]: ${error.message}`);
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  }

  public put<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export a default instance of the ApiClient, configured with a base URL.
// In a real application, this base URL would typically come from environment variables.
const api = new ApiClient(import.meta.env.VITE_API_BASE_URL || '/api');

export default api;
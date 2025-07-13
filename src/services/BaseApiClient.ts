import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '../utils/logger';

// Define custom error types for API client
export enum ApiErrorType {
  NetworkError = 'NETWORK_ERROR',
  ServerError = 'SERVER_ERROR',
  ClientError = 'CLIENT_ERROR',
  AuthenticationError = 'AUTHENTICATION_ERROR',
  UnknownError = 'UNKNOWN_ERROR',
}

export class ApiClientError extends Error {
  public type: ApiErrorType;
  public details: any;
  public statusCode?: number;
  public errorCode?: string;

  constructor(message: string, type: ApiErrorType, details: any = {}, statusCode?: number, errorCode?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.type = type;
    this.details = details;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export abstract class BaseApiClient {
  protected axiosInstance: AxiosInstance;
  protected baseUrl: string;
  protected maxRetries: number;
  protected retryDelayMs: number;

  constructor(baseUrl: string, maxRetries: number = 3, retryDelayMs: number = 1000) {
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Abstract method to provide authentication headers.
   * Specific API clients will implement this based on their authentication mechanism.
   */
  protected abstract getAuthHeaders(): Record<string, string>;

  protected async request<T>(config: AxiosRequestConfig, retries: number = 0): Promise<T> {
    const url = config.url || '';
    const method = config.method || 'GET';

    try {
      Logger.info(`Making API request: ${method} ${url}`, {
        url: this.baseUrl + url,
        method,
        requestAttempt: retries + 1,
      });

      const authHeaders = this.getAuthHeaders();
      const response: AxiosResponse<T> = await this.axiosInstance({
        ...config,
        headers: {
          ...this.axiosInstance.defaults.headers.common,
          ...config.headers,
          ...authHeaders,
        },
      });

      Logger.info(`API request successful: ${method} ${url}`, {
        status: response.status,
        responseData: response.data, // Log response data, but be cautious with sensitive info
      });
      return response.data;
    } catch (error) {
      const apiClientError = this.handleError(error);

      if (this.isRetriableError(apiClientError) && retries < this.maxRetries) {
        const delay = this.retryDelayMs * Math.pow(2, retries);
        Logger.warn(`Retrying request to ${url} in ${delay}ms. Attempt ${retries + 1}/${this.maxRetries}`, {
          url,
          method,
          retryAttempt: retries + 1,
          maxRetries: this.maxRetries,
          errorType: apiClientError.type,
          errorCode: apiClientError.errorCode,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(config, retries + 1);
      }

      throw apiClientError;
    }
  }

  private handleError(error: any): ApiClientError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const { data, status } = axiosError.response;
        Logger.error(`API Error: Status ${status}`, {
          status,
          details: data,
          message: axiosError.message,
        });

        if (status === 401 || status === 403) {
          return new ApiClientError('Authentication or authorization failed.', ApiErrorType.AuthenticationError, data, status);
        } else if (status >= 400 && status < 500) {
          return new ApiClientError('Client-side error from API.', ApiErrorType.ClientError, data, status);
        } else if (status >= 500) {
          return new ApiClientError('Server-side error from API.', ApiErrorType.ServerError, data, status);
        }
      } else if (axiosError.request) {
        Logger.error('Network Error during API request:', {
          message: axiosError.message,
          code: axiosError.code,
          configUrl: axiosError.config?.url,
          configMethod: axiosError.config?.method,
        });
        return new ApiClientError('Network error during API request. Please try again.', ApiErrorType.NetworkError, axiosError.message);
      } else {
        Logger.error('Error setting up API request:', {
          message: axiosError.message,
          stack: axiosError.stack,
        });
        return new ApiClientError('Failed to set up API request.', ApiErrorType.UnknownError, axiosError.message);
      }
    } else if (error instanceof Error) {
      Logger.error('An unexpected error occurred:', {
        message: error.message,
        stack: error.stack,
      });
      return new ApiClientError('An unexpected error occurred during API processing.', ApiErrorType.UnknownError, error.message);
    }

    Logger.error('An unknown error type occurred:', { error });
    return new ApiClientError('An unknown error occurred during API processing.', ApiErrorType.UnknownError, error);
  }

  private isRetriableError(error: ApiClientError): boolean {
    return error.type === ApiErrorType.NetworkError ||
           (error.type === ApiErrorType.ServerError && (error.statusCode !== undefined && error.statusCode >= 500));
  }
}
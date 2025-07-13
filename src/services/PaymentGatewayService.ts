import axios, { AxiosError } from 'axios';
import { Config } from '../config/config';
import { Logger } from '../utils/logger'; // Import the Logger

// Define custom error types
export enum PaymentErrorType {
  NetworkError = 'NETWORK_ERROR',
  GatewayError = 'GATEWAY_ERROR',
  BusinessLogicError = 'BUSINESS_LOGIC_ERROR',
  UnknownError = 'UNKNOWN_ERROR',
}

// Interface for common payment gateway error response structure
interface PaymentGatewayErrorResponse {
  result?: string;
  status?: string;
  errorCode?: string;
  reasonCode?: string;
  message?: string;
  // Add other common error fields as needed, but ensure they are non-sensitive
}

export class PaymentError extends Error {
  public type: PaymentErrorType;
  public details: any;
  public statusCode?: number;
  public errorCode?: string;

  constructor(message: string, type: PaymentErrorType, details: any = {}, statusCode?: number, errorCode?: string) {
    super(message);
    this.name = 'PaymentError';
    this.type = type;
    this.details = details;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export class PaymentGatewayService {
  private baseUrl: string;
  private merchantId: string;
  private apiPassword: string; // This should not be logged
  private apiVersion: string;
  private maxRetries: number;
  private retryDelayMs: number;

  constructor() {
    const config = Config.getPaymentGatewayConfig();
    this.baseUrl = config.host;
    this.merchantId = config.merchantId;
    this.apiPassword = config.apiPassword; // Loaded but not used in logs
    this.apiVersion = config.apiVersion;
    this.maxRetries = 3; // Default max retries
    this.retryDelayMs = 1000; // Default delay of 1 second
  }

  protected async makeRequest(endpoint: string, method: string, data?: any, retries: number = 0): Promise<any> {
    const url = `${this.baseUrl}/api/rest/version/${this.apiVersion}/merchant/${this.merchantId}${endpoint}`;

    try {
      Logger.info(`Making payment gateway request: ${method} ${endpoint}`, {
        url: this.baseUrl + endpoint, // Log base URL and endpoint, not full URL with merchant ID
        method,
        // Do not log 'data' directly if it contains sensitive information.
        // For payment requests, 'data' often contains card details.
        // Log only non-sensitive identifiers if available, e.g., orderId, transactionType.
        requestAttempt: retries + 1
      });

      const response = await axios({
        method,
        url,
        data,
        auth: {
          username: `merchant.${this.merchantId}`,
          password: this.apiPassword // Do not log this
        }
      });

      Logger.info(`Payment gateway request successful: ${method} ${endpoint}`, {
        status: response.status,
        // Log non-sensitive response data, e.g., transactionId, status
        responseId: response.data?.id,
        responseStatus: response.data?.status
      });
      return response.data;
    } catch (error) {
      const paymentError = this.handleError(error);

      if (this.isRetriableError(paymentError) && retries < this.maxRetries) {
        const delay = this.retryDelayMs * Math.pow(2, retries);
        Logger.warn(`Retrying request to ${endpoint} in ${delay}ms. Attempt ${retries + 1}/${this.maxRetries}`, {
          endpoint,
          method,
          retryAttempt: retries + 1,
          maxRetries: this.maxRetries,
          errorType: paymentError.type,
          errorCode: paymentError.errorCode
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, method, data, retries + 1);
      }

      throw paymentError;
    }
  }

  private handleError(error: any): PaymentError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<PaymentGatewayErrorResponse>;
      if (axiosError.response) {
        const { data, status } = axiosError.response;
        // Log error response, but filter out sensitive data
        // Log error response, but filter out sensitive data if present in the actual response
        // The PaymentGatewayErrorResponse interface does not currently define sensitive fields like card, customer, or source.
        // If these were to be added to the interface or received in the actual response,
        // explicit redaction logic would be needed here.
        Logger.error(`Payment Gateway Error: Status ${status}`, {
          status,
          errorCode: data?.errorCode,
          reasonCode: data?.reasonCode,
          message: data?.message,
          details: data // Log the non-sensitive parts of the error data
        });

        // Categorize gateway-specific errors
        if (status >= 400 && status < 500) {
          if (data?.result === 'DECLINED' || data?.status === 'DECLINED') {
            return new PaymentError('Payment declined by gateway.', PaymentErrorType.BusinessLogicError, data, status, data?.errorCode);
          }
          if (status === 401 || status === 403) {
            return new PaymentError('Authentication or authorization failed with paymentGateway.', PaymentErrorType.GatewayError, data, status, data?.errorCode);
          }
          if (status === 400 && data?.reasonCode === 'INVALID_FIELD') {
            return new PaymentError('Invalid request data sent to payment gateway.', PaymentErrorType.BusinessLogicError, data, status, data?.errorCode);
          }
          // Generic client-side gateway error
          return new PaymentError('Payment gateway rejected the request.', PaymentErrorType.GatewayError, data, status, data?.errorCode);
        } else if (status >= 500) {
          // Server-side gateway errors (potentially transient)
          return new PaymentError('Payment gateway internal error.', PaymentErrorType.GatewayError, data, status, data?.errorCode);
        }
      } else if (axiosError.request) {
        // Network error (no response received)
        Logger.error('Network Error during payment gateway request:', {
          message: axiosError.message,
          code: axiosError.code,
          isAxiosError: axiosError.isAxiosError,
          configUrl: axiosError.config?.url,
          configMethod: axiosError.config?.method
        });
        return new PaymentError('Network error during payment processing. Please try again.', PaymentErrorType.NetworkError, axiosError.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        Logger.error('Error setting up payment gateway request:', {
          message: axiosError.message,
          stack: axiosError.stack
        });
        return new PaymentError('Failed to set up payment request.', PaymentErrorType.UnknownError, axiosError.message);
      }
    } else if (error instanceof Error) {
      Logger.error('An unexpected error occurred:', {
        message: error.message,
        stack: error.stack
      });
      return new PaymentError('An unexpected error occurred during payment processing.', PaymentErrorType.UnknownError, error.message);
    }

    // Fallback for any other unhandled error
    Logger.error('An unknown error type occurred:', { error });
    return new PaymentError('An unknown error occurred during payment processing.', PaymentErrorType.UnknownError, error);
  }

  private isRetriableError(error: PaymentError): boolean {
    // Define which error types are retriable
    return error.type === PaymentErrorType.NetworkError ||
           (error.type === PaymentErrorType.GatewayError && (error.statusCode !== undefined && error.statusCode >= 500));
  }
}

import { PAYPAL_CONFIG, getPayPalAuthHeader } from '../config/paypal.config';
import { PaymentError, PaymentErrorType } from './PaymentGatewayService'; // Import common error types
import { IPaymentGateway } from '../interfaces/IPaymentGateway';

const BASE_URL = PAYPAL_CONFIG.environment === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

// Interface for common PayPal error response structure
interface PayPalErrorResponse {
  name: string;
  message: string;
  debug_id?: string;
  details?: Array<{
    issue: string;
    field?: string;
    description?: string;
  }>;
  // Add other common error fields as needed
}

export class PayPalService implements IPaymentGateway {
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;

  private async makePayPalRequest(
    endpoint: string,
    method: string,
    body?: any,
    retries: number = 0
  ): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': getPayPalAuthHeader(),
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData: PayPalErrorResponse = await response.json();
        const paymentError = this.handlePayPalError(response.status, errorData);

        if (this.isRetriableError(paymentError) && retries < this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, retries);
          console.warn(`Retrying PayPal request to ${endpoint} in ${delay}ms. Attempt ${retries + 1}/${this.maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makePayPalRequest(endpoint, method, body, retries + 1);
        }

        throw paymentError;
      }

      return response.json();
    } catch (error) {
      // Handle network errors or other unexpected errors during fetch
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network Error during PayPal request:', error.message);
        const paymentError = new PaymentError('Network error during PayPal processing. Please try again.', PaymentErrorType.NetworkError, error.message);
        
        if (this.isRetriableError(paymentError) && retries < this.maxRetries) {
          const delay = this.retryDelayMs * Math.pow(2, retries);
          console.warn(`Retrying PayPal request to ${endpoint} in ${delay}ms. Attempt ${retries + 1}/${this.maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makePayPalRequest(endpoint, method, body, retries + 1);
        }
        throw paymentError;
      }
      
      // Re-throw if it's already a PaymentError or another unhandled error
      if (error instanceof PaymentError) {
        throw error;
      }
      console.error('An unexpected error occurred during PayPal request:', error);
      throw new PaymentError('An unexpected error occurred during PayPal processing.', PaymentErrorType.UnknownError, error);
    }
  }

  async createOrder(amount: number, currency: string = PAYPAL_CONFIG.currency, orderDetails?: any): Promise<any> {
    const orderData = {
      intent: PAYPAL_CONFIG.intent,
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toString()
        },
        ...orderDetails
      }]
    };
    return this.makePayPalRequest('/v2/checkout/orders', 'POST', orderData);
  }

  async capturePayment(orderId: string, captureDetails?: any): Promise<any> {
    return this.makePayPalRequest(`/v2/checkout/orders/${orderId}/capture`, 'POST', captureDetails);
  }

  async processWebhook(req: any, res: any): Promise<void> {
    console.log('PayPalService: Webhook processing not fully implemented for PayPal.');
    // In a real application, you would verify the webhook signature and process the event
    res.status(200).send('Webhook received (not fully processed)');
  }

  async refundPayment(transactionId: string, refundAmount?: number, refundDetails?: any): Promise<any> {
    console.log(`PayPalService: Refund payment for transaction ${transactionId} not fully implemented.`);
    // In a real application, you would call the PayPal refund API
    return Promise.resolve({
      status: 'PENDING',
      message: 'Refund processing initiated (placeholder)',
      transactionId: transactionId,
      refundAmount: refundAmount
    });
  }

  async voidPayment(authorizationId: string): Promise<any> {
    console.log(`PayPalService: Void payment for authorization ${authorizationId} not fully implemented.`);
    // In a real application, you would call the PayPal void API
    return Promise.resolve({
      status: 'VOIDED',
      message: 'Payment voided (placeholder)',
      authorizationId: authorizationId
    });
  }

  private handlePayPalError(statusCode: number, errorData: PayPalErrorResponse): PaymentError {
    console.error(`PayPal Error: Status ${statusCode}, Name: ${errorData.name}, Message: ${errorData.message}, Details:`, errorData.details);

    switch (errorData.name) {
      case 'UNPROCESSABLE_ENTITY':
        if (errorData.details?.some(detail => detail.issue === 'INSTRUMENT_DECLINED')) {
          return new PaymentError('Payment instrument declined. Please try another payment method.', PaymentErrorType.BusinessLogicError, errorData, statusCode, 'INSTRUMENT_DECLINED');
        }
        if (errorData.details?.some(detail => detail.issue === 'INSUFFICIENT_FUNDS')) {
          return new PaymentError('Insufficient funds. Please check your balance or try another payment method.', PaymentErrorType.BusinessLogicError, errorData, statusCode, 'INSUFFICIENT_FUNDS');
        }
        return new PaymentError('Invalid request or unprocessable entity from PayPal.', PaymentErrorType.BusinessLogicError, errorData, statusCode, errorData.name);
      case 'AUTHENTICATION_FAILURE':
        return new PaymentError('Authentication failed with PayPal. Invalid credentials.', PaymentErrorType.GatewayError, errorData, statusCode, errorData.name);
      case 'RESOURCE_NOT_FOUND':
        return new PaymentError('PayPal resource not found. The order ID might be invalid.', PaymentErrorType.BusinessLogicError, errorData, statusCode, errorData.name);
      case 'INTERNAL_SERVER_ERROR':
        return new PaymentError('PayPal internal server error. Please try again later.', PaymentErrorType.GatewayError, errorData, statusCode, errorData.name);
      case 'SERVICE_UNAVAILABLE':
        return new PaymentError('PayPal service is temporarily unavailable. Please try again.', PaymentErrorType.NetworkError, errorData, statusCode, errorData.name);
      default:
        // Generic PayPal error
        return new PaymentError(`PayPal error: ${errorData.message || 'An unknown error occurred.'}`, PaymentErrorType.GatewayError, errorData, statusCode, errorData.name);
    }
  }

  private isRetriableError(error: PaymentError): boolean {
    // PayPal specific retriable errors
    return error.type === PaymentErrorType.NetworkError ||
           (error.type === PaymentErrorType.GatewayError && (error.statusCode !== undefined && (error.statusCode === 500 || error.statusCode === 503)));
  }
}

/**
 * Common TypeScript interfaces and types for payment operations.
 * These types ensure consistency across IPaymentGateway implementations and improve type safety.
 */

/**
 * Represents a request to create an order or initiate a payment.
 */
export interface OrderCreationRequest {
  amount: number; // Amount in major units (e.g., 10.50)
  currency: string; // ISO 4217 currency code (e.g., "USD")
  orderId: string; // Unique identifier for the order
  description?: string;
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
  };
  items?: OrderItem[];
  metadata?: Record<string, any>; // Generic metadata
}

/**
 * Represents an address.
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2 country code (e.g., "US")
}

/**
 * Represents an item in an order.
 */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number; // Price per unit in major units
  currency: string;
  description?: string;
}

/**
 * Represents a response after a payment capture operation.
 */
export interface PaymentCaptureResponse {
  transactionId: string; // Unique ID from the payment gateway for the transaction
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'VOIDED';
  amountCaptured: number; // Amount captured in major units
  currency: string;
  orderId?: string; // Original order ID if available
  gatewayResponseCode?: string; // Gateway specific response code
  gatewayResponseMessage?: string; // Gateway specific response message
  capturedAt: string; // ISO 8601 timestamp
  metadata?: Record<string, any>;
}

/**
 * Represents a request to refund a payment.
 */
export interface RefundRequest {
  transactionId: string; // The ID of the transaction to refund
  amount?: number; // Optional: specific amount to refund in major units. If not provided, full refund.
  currency?: string; // Optional: currency of the refund. If not provided, original transaction currency.
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents a response after a refund operation.
 */
export interface RefundResponse {
  refundId: string; // Unique ID from the payment gateway for the refund
  transactionId: string; // Original transaction ID
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amountRefunded: number; // Amount refunded in major units
  currency: string;
  gatewayResponseCode?: string;
  gatewayResponseMessage?: string;
  refundedAt: string; // ISO 8601 timestamp
  metadata?: Record<string, any>;
}

/**
 * Represents a request to void a payment (cancel an authorization).
 */
export interface VoidRequest {
  transactionId: string; // The ID of the transaction to void (usually an authorization ID)
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * Represents a response after a void operation.
 */
export interface VoidResponse {
  voidId: string; // Unique ID from the payment gateway for the void operation
  transactionId: string; // Original transaction ID
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  gatewayResponseCode?: string;
  gatewayResponseMessage?: string;
  voidedAt: string; // ISO 8601 timestamp
  metadata?: Record<string, any>;
}

/**
 * Represents a generic webhook event received from a payment gateway.
 */
export interface WebhookEvent {
  id: string; // Unique ID of the webhook event
  type: string; // Type of event (e.g., "payment.succeeded", "refund.created")
  timestamp: number; // Unix timestamp in milliseconds
  data: Record<string, any>; // The actual event data payload from the gateway
  signature?: string; // The signature from the webhook header, if available
  gateway: string; // Identifier for the payment gateway (e.g., "stripe", "paypal")
  metadata?: Record<string, any>;
}
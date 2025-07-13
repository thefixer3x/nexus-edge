import { PaymentRequest } from '../models/PaymentRequest';
import { PaymentGatewayFactory } from '../services/PaymentGatewayFactory';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { Logger } from '../utils/logger'; // Import the Logger

// Placeholder for a real OrderService and PaymentGatewayWebhookService
// In a real application, these would interact with your database and other services.
class OrderService {
  static async updateOrderStatus(orderId: string, status: string, transactionId: string) {
    Logger.info(`OrderService: Updating order status`, { orderId, status, transactionId });
    // Simulate database update
    return { success: true, orderId, status };
  }
}

class PaymentGatewayWebhookService {
  static async processPaymentCaptureCompleted(payload: any) {
    const orderId = payload.resource.invoice_id || payload.resource.custom_id;
    const transactionId = payload.resource.id;
    Logger.info('PaymentGatewayWebhookService: Processing PAYMENT.CAPTURE.COMPLETED event', { orderId, transactionId });
    await OrderService.updateOrderStatus(orderId, 'COMPLETED', transactionId);
    // Trigger post-payment actions (e.g., update inventory, send confirmation emails)
    Logger.info('Triggering post-payment actions for completed payment.', { orderId, transactionId });
  }

  static async processPaymentCaptureDenied(payload: any) {
    const orderId = payload.resource.invoice_id || payload.resource.custom_id;
    const transactionId = payload.resource.id;
    Logger.warn('PaymentGatewayWebhookService: Processing PAYMENT.CAPTURE.DENIED event', { orderId, transactionId });
    await OrderService.updateOrderStatus(orderId, 'DENIED', transactionId);
    Logger.info('Triggering actions for denied payment.', { orderId, transactionId });
  }

  static async processRefundCompleted(payload: any) {
    const orderId = payload.resource.invoice_id || payload.resource.custom_id;
    const refundId = payload.resource.id;
    Logger.info('PaymentGatewayWebhookService: Processing REFUND.COMPLETED event', { orderId, refundId });
    await OrderService.updateOrderStatus(orderId, 'REFUNDED', refundId);
    Logger.info('Triggering actions for completed refund.', { orderId, refundId });
  }

  static async processOtherEvent(eventType: string, payload: any) {
    // Log the full payload for unhandled events for debugging, ensuring no sensitive data
    const safePayload = { ...payload };
    if (safePayload.resource && safePayload.resource.amount) {
      // Example: Redact sensitive fields if they were present (though they shouldn't be for webhooks)
      // This is a safeguard.
      delete safePayload.resource.credit_card;
      delete safePayload.resource.payer_info;
    }
    Logger.info(`PaymentGatewayWebhookService: Processing unhandled event type: ${eventType}`, { eventType, payload: safePayload });
  }
}


export class PaymentController {
  constructor() {
    PaymentGatewayFactory.initialize(); // Initialize the factory to register gateways
  }

  public async initiateCheckout(amount: number, currency: string, gatewayType: string) {
    Logger.info('Initiating checkout process', { amount, currency, gatewayType });
    const gateway = PaymentGatewayFactory.getGateway(gatewayType);
    const order = await gateway.createOrder(amount, currency);
    Logger.info(`${gatewayType} order created successfully`, { orderId: order.id, amount, currency });
    return { orderId: order.id };
  }

  public async processPayment(orderId: string, payerId: string, gatewayType: string) {
    Logger.info('Processing payment capture', { orderId, payerId, gatewayType });
    const gateway = PaymentGatewayFactory.getGateway(gatewayType);
    const capture = await gateway.capturePayment(orderId);
    Logger.info('Payment capture completed', { orderId, captureStatus: capture.status, gatewayType });
    return capture;
  }

  private determineGatewayFromHeaders(headers: any): string | null {
    if (headers['paypal-transmission-id']) {
      return 'PayPal';
    }
    // Add logic for other gateways, e.g., Stripe
    // if (headers['stripe-signature']) {
    //   return 'Stripe';
    // }
    return null;
  }

  public async handleWebhook(req: any, res: any) {
    const gatewayType = this.determineGatewayFromHeaders(req.headers);

    if (!gatewayType) {
      Logger.error('Unknown gateway type for incoming webhook. Headers:', req.headers);
      return res.status(400).send('Unknown gateway type');
    }

    try {
      const gateway = PaymentGatewayFactory.getGateway(gatewayType);
      await gateway.processWebhook(req.headers, req.body);
      Logger.info(`Webhook processed successfully for ${gatewayType}`, { gatewayType, webhookId: req.body.id });
      return res.status(200).send('Webhook processed successfully');
    } catch (error: any) {
      Logger.error(`Error processing webhook for ${gatewayType}:`, {
        gatewayType,
        webhookId: req.body.id,
        message: error.message,
        stack: error.stack
      });
      return res.status(500).send('Error processing webhook');
    }
  }
}

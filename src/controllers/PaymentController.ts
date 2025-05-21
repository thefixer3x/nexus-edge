import { PaymentGatewayService } from '../services/PaymentGatewayService';
import { PaymentRequest } from '../models/PaymentRequest';

export class PaymentController {
  private gatewayService: PaymentGatewayService;

  constructor() {
    this.gatewayService = new PaymentGatewayService();
  }

  async initiateCheckout(request: PaymentRequest) {
    return await this.gatewayService.makeRequest(
      '/session',
      'POST',
      request
    );
  }

  async processPayment(orderId: string, request: PaymentRequest) {
    return await this.gatewayService.makeRequest(
      `/order/${orderId}/transaction/1`,
      'PUT',
      request
    );
  }

  async retrieveOrder(orderId: string) {
    return await this.gatewayService.makeRequest(
      `/order/${orderId}`,
      'GET'
    );
  }

  async createSession() {
    return await this.gatewayService.makeRequest(
      '/session',
      'POST'
    );
  }

  async updateSession(sessionId: string, request: PaymentRequest) {
    return await this.gatewayService.makeRequest(
      `/session/${sessionId}`,
      'PUT',
      request
    );
  }
}

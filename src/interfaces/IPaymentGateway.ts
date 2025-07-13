export interface IPaymentGateway {
  createOrder(amount: number, currency: string, orderDetails?: any): Promise<any>;
  capturePayment(orderId: string, captureDetails?: any): Promise<any>;
  processWebhook(req: any, res: any): Promise<void>;
  refundPayment(transactionId: string, refundAmount?: number, refundDetails?: any): Promise<any>;
  voidPayment(authorizationId: string): Promise<any>;
}
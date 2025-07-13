import { PaymentController } from '../PaymentController';
import { PayPalService } from '../../services/paypal.service';
import crypto from 'crypto';
import fetch from 'node-fetch';

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());

// Mock crypto.createVerify and verifier.verify
const mockVerify = jest.fn();
const mockUpdate = jest.fn();
jest.spyOn(crypto, 'createVerify').mockReturnValue({
  update: mockUpdate,
  verify: mockVerify,
} as any);

// Mock PayPalService methods
jest.mock('../../services/paypal.service', () => ({
  PayPalService: {
    createOrder: jest.fn(),
    capturePayment: jest.fn(),
  },
}));

describe('PaymentController', () => {
  let paymentController: PaymentController;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    paymentController = new PaymentController();
    mockReq = {
      headers: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('handleWebhook', () => {
    const mockCertUrl = 'https://api.paypal.com/v1/notifications/webhooks-certificates/abc123def456';
    const mockTransmissionId = 'some_transmission_id';
    const mockTransmissionTime = '2023-01-01T12:00:00Z';
    const mockWebhookEventBody = JSON.stringify({
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource: {
        invoice_id: 'ORDER123',
        id: 'TRANSACTION456',
      },
    });
    const mockSignature = 'mock_signature';
    const mockCertificate = '-----BEGIN PUBLIC KEY-----\nMOCK_CERTIFICATE_CONTENT\n-----END PUBLIC KEY-----';

    beforeEach(() => {
      mockReq.headers = {
        'paypal-transmission-sig': mockSignature,
        'paypal-transmission-id': mockTransmissionId,
        'paypal-transmission-time': mockTransmissionTime,
        'paypal-cert-url': mockCertUrl,
      };
      mockReq.body = JSON.parse(mockWebhookEventBody);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockCertificate),
      });
    });

    it('should return 400 if required PayPal webhook headers are missing', async () => {
      mockReq.headers = {}; // Clear all headers
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith('Missing required headers');
    });

    it('should return 500 if certificate fetching fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Certificate fetching failed');
    });

    it('should return 403 if signature verification fails', async () => {
      mockVerify.mockReturnValueOnce(false); // Simulate verification failure
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith('Signature verification failed');
    });

    it('should return 200 and process event if signature is valid', async () => {
      mockVerify.mockReturnValueOnce(true); // Simulate successful verification
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Webhook processed successfully');
      // Further assertions can be added here to check if OrderService.updateOrderStatus was called
      // For now, we'll rely on the console.log in the actual service for demonstration.
    });

    it('should handle PAYMENT.CAPTURE.COMPLETED event', async () => {
      mockVerify.mockReturnValueOnce(true);
      const spy = jest.spyOn(paymentController as any, 'PaymentGatewayWebhookService').mockImplementationOnce(() => ({
        processPaymentCaptureCompleted: jest.fn(),
      }));
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Webhook processed successfully');
      spy.mockRestore();
    });

    it('should handle PAYMENT.CAPTURE.DENIED event', async () => {
      mockVerify.mockReturnValueOnce(true);
      mockReq.body.event_type = 'PAYMENT.CAPTURE.DENIED';
      const spy = jest.spyOn(paymentController as any, 'PaymentGatewayWebhookService').mockImplementationOnce(() => ({
        processPaymentCaptureDenied: jest.fn(),
      }));
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Webhook processed successfully');
      spy.mockRestore();
    });

    it('should handle REFUND.COMPLETED event', async () => {
      mockVerify.mockReturnValueOnce(true);
      mockReq.body.event_type = 'REFUND.COMPLETED';
      const spy = jest.spyOn(paymentController as any, 'PaymentGatewayWebhookService').mockImplementationOnce(() => ({
        processRefundCompleted: jest.fn(),
      }));
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Webhook processed successfully');
      spy.mockRestore();
    });

    it('should handle unhandled event types', async () => {
      mockVerify.mockReturnValueOnce(true);
      mockReq.body.event_type = 'SOME_OTHER_EVENT';
      const spy = jest.spyOn(paymentController as any, 'PaymentGatewayWebhookService').mockImplementationOnce(() => ({
        processOtherEvent: jest.fn(),
      }));
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Webhook processed successfully');
      spy.mockRestore();
    });

    it('should return 500 if an error occurs during event processing', async () => {
      mockVerify.mockReturnValueOnce(true);
      mockReq.body.event_type = 'PAYMENT.CAPTURE.COMPLETED';
      jest.spyOn(paymentController as any, 'PaymentGatewayWebhookService').mockImplementationOnce(() => ({
        processPaymentCaptureCompleted: jest.fn().mockRejectedValueOnce(new Error('Processing error')),
      }));
      await paymentController.handleWebhook(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith('Error processing webhook');
    });
  });
});
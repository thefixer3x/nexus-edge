import express from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = express.Router();
const paymentController = new PaymentController();

router.post('/checkout', async (req, res) => {
  try {
    const { amount, currency, gatewayType } = req.body;
    const response = await paymentController.initiateCheckout(amount, currency, gatewayType);
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/process/:orderId', async (req, res) => {
  try {
    const { payerId, gatewayType } = req.body;
    const response = await paymentController.processPayment(
      req.params.orderId,
      payerId,
      gatewayType
    );
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/webhook', async (req, res) => {
  try {
    await paymentController.handleWebhook(req, res); // Pass req and res directly
  } catch (error) {
    console.error('Error processing webhook:', error);
    // The handleWebhook method now sends the response, so we don't need to send it here.
    // However, if an unexpected error occurs before handleWebhook can send a response,
    // we should still send a 500.
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error during webhook processing');
    }
  }
});

export default router;

import express from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = express.Router();
const paymentController = new PaymentController();

router.post('/checkout', async (req, res) => {
  try {
    const response = await paymentController.initiateCheckout(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/process/:orderId', async (req, res) => {
  try {
    const response = await paymentController.processPayment(
      req.params.orderId,
      req.body
    );
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get('/order/:orderId', async (req, res) => {
  try {
    const response = await paymentController.retrieveOrder(req.params.orderId);
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;

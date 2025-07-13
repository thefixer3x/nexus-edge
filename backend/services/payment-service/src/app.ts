import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3005; // Unique port for Payment Service

// Placeholder Endpoints for Payment Service
app.post('/api/payments/checkout', (req, res) => {
  console.log('Initiate checkout request received:', req.body);
  // Simulate order creation with a payment gateway
  const orderId = `order-${Date.now()}`;
  res.status(200).send({ message: 'Checkout initiated (placeholder)', orderId });
});

app.post('/api/payments/process/:orderId', (req, res) => {
  console.log(`Process payment for order ID: ${req.params.orderId}`, req.body);
  // Simulate payment capture
  res.status(200).send({ message: 'Payment processed (placeholder)', orderId: req.params.orderId, status: 'COMPLETED' });
});

app.post('/api/payments/webhook', (req, res) => {
  console.log('Payment webhook received:', req.body);
  // Simulate webhook processing
  const eventType = req.body.event_type || 'UNKNOWN';
  console.log(`Processing webhook event type: ${eventType}`);
  res.status(200).send('Webhook processed successfully (placeholder)');
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
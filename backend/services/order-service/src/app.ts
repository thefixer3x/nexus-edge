import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004; // Unique port for Order Service

// Placeholder Endpoints for Order Service
app.post('/api/orders', (req, res) => {
  console.log('Create new order request received:', req.body);
  res.status(201).send({ message: 'Order created successfully (placeholder)', orderId: 'order-123' });
});

app.get('/api/orders/:id', (req, res) => {
  console.log(`Request for order ID: ${req.params.id}`);
  res.status(200).send({ id: req.params.id, userId: 'user-abc', status: 'pending', items: [], total: 0 });
});

app.put('/api/orders/:id/status', (req, res) => {
  console.log(`Update status for order ID: ${req.params.id} to ${req.body.status}`);
  res.status(200).send({ message: 'Order status updated (placeholder)', orderId: req.params.id, newStatus: req.body.status });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
import express from 'express';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002; // Unique port for Product Service

// Placeholder Endpoints for Product Service
app.get('/api/products', (req, res) => {
  console.log('Request for all products received');
  res.status(200).send([
    { id: 'prod1', name: 'Sample Product 1', price: 19.99, category: 'Electronics' },
    { id: 'prod2', name: 'Sample Product 2', price: 29.99, category: 'Books' }
  ]);
});

app.get('/api/products/:id', (req, res) => {
  console.log(`Request for product ID: ${req.params.id}`);
  res.status(200).send({ id: req.params.id, name: `Product ${req.params.id}`, price: 99.99, description: `Details for product ${req.params.id}` });
});

app.post('/api/products', authenticateJWT, authorizeRoles(['admin']), (req, res) => {
  console.log('Add new product request received:', req.body);
  res.status(201).send({ message: 'Product added successfully (placeholder)', productId: 'new-prod-id' });
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
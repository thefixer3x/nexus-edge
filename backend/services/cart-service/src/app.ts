import express from 'express';
import { authenticateJWT, authorizeRoles } from '../../middleware/auth';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003; // Unique port for Cart Service

// Placeholder Endpoints for Cart Service
app.get('/api/cart/:userId', authenticateJWT, (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = (req as any).user.id; // Assuming user ID is in JWT payload

  if (requestedUserId !== authenticatedUserId && !(req as any).user.roles.includes('admin')) {
    return res.sendStatus(403); // Forbidden if not authorized to view this cart
  }

  console.log(`Request for cart of user ID: ${requestedUserId}`);
  res.status(200).send({ userId: requestedUserId, items: [], total: 0 });
});

app.post('/api/cart/:userId/items', authenticateJWT, authorizeRoles(['user', 'admin']), (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = (req as any).user.id;

  if (requestedUserId !== authenticatedUserId && !(req as any).user.roles.includes('admin')) {
    return res.sendStatus(403); // Forbidden if not authorized to modify this cart
  }

  console.log(`Add item to cart for user ID: ${requestedUserId}`, req.body);
  res.status(200).send({ message: 'Item added to cart (placeholder)' });
});

app.delete('/api/cart/:userId/items/:itemId', authenticateJWT, authorizeRoles(['user', 'admin']), (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = (req as any).user.id;

  if (requestedUserId !== authenticatedUserId && !(req as any).user.roles.includes('admin')) {
    return res.sendStatus(403); // Forbidden if not authorized to modify this cart
  }

  console.log(`Remove item ${req.params.itemId} from cart for user ID: ${requestedUserId}`);
  res.status(200).send({ message: 'Item removed from cart (placeholder)' });
});

app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
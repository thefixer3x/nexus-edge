import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001; // Unique port for User Service
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Replace with a strong, environment-specific secret

// Middleware to verify JWT
const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      (req as any).user = user; // Attach user payload to request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Middleware for Role-Based Access Control (RBAC)
const authorizeRoles = (roles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(req as any).user || !roles.some(role => (req as any).user.roles.includes(role))) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
};

// Placeholder Endpoints for User Service
app.post('/api/users/register', (req, res) => {
  console.log('User registration request received:', req.body);
  // In a real scenario, integrate with Stack Auth for user registration
  res.status(201).send({ message: 'User registered successfully (placeholder)' });
});

app.post('/api/users/login', (req, res) => {
  console.log('User login request received:', req.body);
  // In a real scenario, authenticate with Stack Auth
  const user = { id: '123', username: 'testuser', roles: ['user'] }; // Mock user
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).send({ message: 'User logged in successfully', token });
});

// Protected route example (requires authentication)
app.get('/api/users/:id', authenticateJWT, (req, res) => {
  console.log(`Request for user ID: ${req.params.id}`);
  // Implement RBAC/ABAC logic here based on req.user.roles or other attributes
  // Example: Check if the authenticated user has permission to view this ID
  res.status(200).send({ id: req.params.id, username: `user_${req.params.id}`, email: `user${req.params.id}@example.com`, roles: (req as any).user.roles });
});

// Admin-only route example (requires 'admin' role)
app.get('/api/admin/users', authenticateJWT, authorizeRoles(['admin']), (req, res) => {
  console.log('Admin request for all users received.');
  res.status(200).send([{ id: '123', username: 'testuser', roles: ['user'] }, { id: '456', username: 'adminuser', roles: ['admin'] }]);
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
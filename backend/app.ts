import express from 'express';
import jwt from 'jsonwebtoken';
import aiRoutes from './ai.routes';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use a strong secret from environment variables

// Middleware to verify JWT for all incoming requests
const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  // Allow unauthenticated access to specific routes (e.g., login, register)
  if (req.path === '/api/users/login' || req.path === '/api/users/register' || req.path === '/') {
    return next();
  }

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

app.use(authenticateJWT); // Apply authentication middleware globally

// Mount AI routes
app.use(aiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Backend API is running.');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

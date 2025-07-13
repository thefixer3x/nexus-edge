import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: any; // Define user property to attach decoded JWT payload
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use a strong, environment-specific secret

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach user payload to request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.some(role => req.user.roles.includes(role))) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
};
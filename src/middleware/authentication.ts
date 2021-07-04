import jwt from 'jsonwebtoken';
import { ENV_SETTINGS } from '../conf';
import { Request, Response } from 'express';

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token: string =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ error: true, message: 'No token provided' });
  }
  jwt.verify(token, ENV_SETTINGS.JWT_SECRET as jwt.Secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: true, message: 'Unauthorized access' });
      return;
    }
    req.user = decoded?.id;
    next();
  });
};

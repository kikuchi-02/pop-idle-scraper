import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { ENV_SETTINGS } from '../conf';
import { UserRepository } from '../repositories/user';

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.match(/^Bearer (.*)$/)[1] : undefined;

  if (!token) {
    res.status(403).send({ error: true, message: 'No token provided' });
    return;
  }
  jwt.verify(token, ENV_SETTINGS.SECRET as jwt.Secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: true, message: 'Unauthorized access' });
      return;
    }
    const userRepository = getCustomRepository(UserRepository);
    userRepository.findById(decoded.userId).then(
      (user) => {
        req.user = user;
        next();
      },
      (err) => {
        res.status(401).json({ error: true, message: 'Unauthorized access' });
        return;
      }
    );
  });
};

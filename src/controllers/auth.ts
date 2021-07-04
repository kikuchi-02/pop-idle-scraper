import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV_SETTINGS } from '../conf';
import bcrypt from 'bcrypt';

// https://bezkoder.com/jwt-refresh-token-node-js/

const tokenList: string[] = [];

export const login = async (req: Request, res: Response) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  const user = {} as any;

  const hash = '';
  if (!(await bcrypt.compare(user.password, hash))) {
    res.status(401).send('Invalid password');
    return;
  }

  const token = jwt.sign(
    { id: user.id },
    ENV_SETTINGS.JWT_SECRET as jwt.Secret,
    {
      expiresIn: '5m',
    }
  );
  const refreshToken = jwt.sign(user, ENV_SETTINGS.JWT_SECRET as jwt.Secret, {
    expiresIn: '12h',
  });

  tokenList.push(refreshToken);
  const response = {
    token,
    refreshToken,
  };
  res.status(200).json(response);
};

export const refresh = (req: Request, res: Response) => {
  // if (req.body.refreshToken && tokenList.includes(req.body.refreshToken)) {
  if (req.body.refreshToken) {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    const token = jwt.sign(user, ENV_SETTINGS.JWT_SECRET as jwt.Secret, {
      expiresIn: '5m',
    });
    const response = {
      token,
    };
    res.status(200).json(response);
  } else {
    res.status(404).send('invalid request');
  }
};

export const logout = (req: Request, res: Response) => {
  console.log(req.user);
  res.sendStatus(200);
};

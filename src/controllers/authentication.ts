import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import { ENV_SETTINGS } from '../conf';
import { RefreshToken } from '../entity/RefreshToken';
import { RefreshTokenRepository } from '../repositories/refreshToken';
import { UserRepository } from '../repositories/user';

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    res.status(401).send('Invalid email');
    return;
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).send('Invalid password');
    return;
  }
  const access = jwt.sign({ userId: user.id }, ENV_SETTINGS.SECRET, {
    expiresIn: 60 * 10,
  });
  const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);
  const refreshToken = await refreshTokenRepository.createAndSave(user, 24 * 7);
  const refresh = refreshToken.token;

  delete user.password;
  res.status(200).send({
    access,
    refresh,
    user,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refresh = req.body.refresh;
  if (!refresh) {
    res.status(403).send('Refresh token is required');
    return;
  }

  const refreshTokenRepository = getCustomRepository(RefreshTokenRepository);
  let refreshToken: RefreshToken;
  try {
    refreshToken = await refreshTokenRepository.findByToken(refresh);
  } catch (err) {
    res.status(401).send('Invalid token');
    return;
  }
  if (!refreshToken) {
    res.status(403).send('Refresh token is not in database');
    return;
  }

  if (!refreshToken.verifyExpiration()) {
    await refreshTokenRepository.delete(refreshToken);
    res.status(403).send('Refresh token is expired');
    return;
  }
  const user = refreshToken.user;

  const newAccess = jwt.sign({ userId: user.id }, ENV_SETTINGS.SECRET, {
    expiresIn: 60 * 10,
  });
  await refreshTokenRepository.delete(refreshToken);
  const newRefresh = await refreshTokenRepository.createAndSave(user, 24 * 7);
  res.status(200).send({ access: newAccess, refresh: newRefresh.token, user });
};

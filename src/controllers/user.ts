import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity/User';

export const getUsers = async (req: Request, res: Response) => {
  const repository = getManager().getRepository(User);
  const users = await repository.find();
  res.send(users);
};

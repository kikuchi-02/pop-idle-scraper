import { Request, Response } from 'express';
import { getConnection, getCustomRepository } from 'typeorm';
import { WordInformationRepository } from '../repositories/word';

export const getUserDictionary = async (req: Request, res: Response) => {
  const repository = getCustomRepository(WordInformationRepository);
  const dictionary = await repository.findAll();
  res.status(200).send({ dictionary });
};

export const updateUserDictionary = async (req: Request, res: Response) => {
  const dictionary = await getConnection().transaction(async (manager) => {
    const repository = manager.getCustomRepository(WordInformationRepository);
    await repository.bulkUpdate(req.body.dictionary);
    const dictionary = await repository.findAll().catch((e) => {
      console.error(e);
      return undefined;
    });
    return dictionary;
  });
  if (!dictionary) {
    res.status(403).send('Invalid dictionary');
    return;
  }
  res.json({ dictionary });
};

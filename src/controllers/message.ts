import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { MessageRepository } from '../repositories/message';

export const readMessage = async (req: Request, res: Response) => {
  const scriptId = req.query.scriptId as string;
  if (!scriptId) {
    res.status(403).send('scriptId is required');
    return;
  }

  const messageRepository = getCustomRepository(MessageRepository);

  const messages = await messageRepository
    .findByScriptId(parseInt(scriptId, 10))
    .catch((e) => {
      console.error(e);
    });
  if (!messages) {
    res.status(403).send('Invalid scriptId');
    return;
  }
  res.json(messages);
  return;
};

export const createMessage = async (req: Request, res: Response) => {
  const messageRepository = getCustomRepository(MessageRepository);

  const params = {
    scriptId: req.body.scriptId,
    body: req.body.body,
    author: req.body.author,
    created: req.body.created,
  };

  const messages = await messageRepository.createAndSave(params).catch((e) => {
    console.error(e);
  });
  if (!messages) {
    res.status(403).send('Invalid messages');
    return;
  }
  res.status(201).json(messages);
  return;
};

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
    .findByScriptIdWithChildren(parseInt(scriptId, 10))
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
    uuid: req.body.uuid,
    parentId: req.body.parentId,
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

export const deleteMessages = async (req: Request, res: Response) => {
  const ids = req.query.id as string[];
  if (!ids) {
    res.status(403).send('id is required');
    return;
  }

  const messageRepository = getCustomRepository(MessageRepository);
  try {
    await messageRepository.deleteBulk(ids);
  } catch (err) {
    res.status(403).send('Invalid id');
    return;
  }
  res.status(200).end();
  return;
};

export const deleteMessage = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(403).send('id is required');
    return;
  }

  const messageRepository = getCustomRepository(MessageRepository);
  try {
    await messageRepository.deleteRecursiveById(parseInt(id, 10));
  } catch (err) {
    res.status(403).send('Invalid id');
    return;
  }
  res.status(200).end();
  return;
};

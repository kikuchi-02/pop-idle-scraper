import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ScriptRepository } from '../repositories/script';

export const readScripts = async (req: Request, res: Response) => {
  let pageIndex: number;
  try {
    pageIndex = parseInt(req.query.pageIndex as string, 10);
  } catch (e) {
    res.status(403).send('invalid pageIndex');
    return;
  }
  let pageSize: number;
  try {
    pageSize = parseInt(req.query.pageSize as string, 10);
  } catch (e) {
    res.status(403).send('invalid pageSize');
    return;
  }

  const scriptRepository = getCustomRepository(ScriptRepository);
  const [posts, count] = await scriptRepository.findPagination(
    pageIndex,
    pageSize
  );
  res.json({
    data: posts,
    length: count,
    pageIndex,
    pageSize,
  });
  return;
};

export const readScript = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(403).send('id is required');
    return;
  }

  const scriptRepository = getCustomRepository(ScriptRepository);
  const script = await scriptRepository.findById(parseInt(id, 10));
  if (!script) {
    res.status(403).send('Invalid id');
    return;
  }
  res.json(script);
  return;
};

export const updateScript = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(403).send('id is required');
    return;
  }

  const scriptRepository = getCustomRepository(ScriptRepository);

  const params = {
    title: req.body.title,
    deltaOps: req.body.deltaOps,
    author: req.user,
    id: parseInt(id, 10),
    // status: req.body.status,
  };

  const script = await scriptRepository.updateOrFail(params).catch((e) => {
    console.error(e);
    return undefined;
  });
  if (!script) {
    res.status(403).send('Invalid script');
    return;
  }
  res.json(script);
  return;
};

export const createScript = async (req: Request, res: Response) => {
  const scriptRepository = getCustomRepository(ScriptRepository);

  const params = {
    title: req.body.title,
    deltaOps: req.body.deltaOps,
    author: req.user,
    // status: req.body.status,
  };

  const script = await scriptRepository.createAndSave(params).catch((e) => {
    console.error(e);
    return undefined;
  });
  if (!script) {
    res.status(403).send('Invalid script');
    return;
  }
  res.status(201).json(script);
  return;
};

export const deleteScripts = async (req: Request, res: Response) => {
  const ids = req.query.id as string[];
  if (!ids) {
    res.status(403).send('id is required');
    return;
  }

  const scriptRepository = getCustomRepository(ScriptRepository);
  try {
    await scriptRepository.deleteBulk(ids);
  } catch (err) {
    res.status(403).send('Invalid id');
    return;
  }
  res.status(200).end();
  return;
};

export const deleteScript = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(403).send('id is required');
    return;
  }

  const scriptRepository = getCustomRepository(ScriptRepository);
  try {
    await scriptRepository.deleteById(parseInt(id, 10));
  } catch (err) {
    res.status(403).send('Invalid id');
    return;
  }
  res.status(200).end();
  return;
};

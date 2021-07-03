import { IdleKind, idleKinds, ScrapedResult } from '../typing';
import { searchTweets, switchTwitterAccount } from '../libs/twitter';
import { Cacher } from '../cache';
import { Request, Response } from 'express';

export const getTwitter = async (req: Request, res: Response) => {
  const kind = req.query.kind;
  if (!idleKinds.includes(kind as IdleKind)) {
    res.sendStatus(400).end();
    return;
  }
  const account = switchTwitterAccount(kind as IdleKind);
  const cacher = new Cacher<ScrapedResult>(account);
  const cache = await cacher.getCache();
  if (cache) {
    res.send(JSON.stringify(cache));
    return;
  }
  const value = await searchTweets(account);
  if (!value) {
    res.sendStatus(400).end();
    return;
  }
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 1);
  await cacher.saveCache(value as ScrapedResult, tomorrow);
  res.send(JSON.stringify(value));
  return;
};

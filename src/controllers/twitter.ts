import { Request, Response } from 'express';
import { Cacher } from '../cache';
import { searchTweets, switchTwitterAccount } from '../libs/twitter';
import { IdleKind, idleKinds, ScrapedResult } from '../typing';

export const getTwitter = async (req: Request, res: Response) => {
  const kinds = req.query.kind as IdleKind[];
  if (!kinds) {
    res.send(403).send('kind is required');
    return;
  }
  const invalidKinds = kinds.filter((kind) => !idleKinds.includes(kind));
  if (invalidKinds.length > 0) {
    res.send(403).send(`Invalid kinds: ${invalidKinds}`);
    return;
  }
  const response = await Promise.all(
    kinds.map(async (kind) => {
      const result = { kind, value: undefined };
      const account = switchTwitterAccount(kind as IdleKind);
      const cacher = new Cacher<ScrapedResult>(account);
      const cache = await cacher.getCache();
      if (cache) {
        result.value = cache;
        return result;
      }
      const value = await searchTweets(account);
      if (!value) {
        return result;
      }
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 1);
      await cacher.saveCache(value as ScrapedResult, tomorrow);
      result.value = value;
      return result;
    })
  );

  res.json(response);
  return;
};

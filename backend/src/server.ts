import express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import {
  createPuppeteerCluster,
  switchTwitterAccount,
  searchTweets,
} from './scraper';
import {
  IdleKind,
  idleKinds,
  ScrapedResult,
  Settings,
  SiteName,
  siteNames,
} from './typing';
import * as yaml from 'js-yaml';
import { Cacher } from './cache';
import { todaysMagazines } from './magazine';

(async () => {
  const settings = yaml.load(
    readFileSync(join(process.cwd(), '..', 'envs.yaml'), 'utf-8')
  ) as Settings;

  const app = express();
  const cluster = await createPuppeteerCluster();

  app.get('*', (req, res, next) => {
    console.log('request', req.path);

    // TODO
    // const cacher = new Cacher<ScrapedResult>(req.originalUrl);
    // const cache = cacher.getCache();
    // if (cache) {
    //   res.send();
    // }
    next();
  });

  app.get('/api/twitter', async (req, res) => {
    const kind = req.query.kind;
    if (!idleKinds.includes(kind as IdleKind)) {
      res.sendStatus(400).end();
      return;
    }
    const account = switchTwitterAccount(kind as IdleKind);
    const cacher = new Cacher<ScrapedResult>(account);
    const cache = cacher.getCache();
    if (cache) {
      res.send(JSON.stringify(cache));
      return;
    }
    const value = await searchTweets(settings, account);
    if (!value) {
      res.sendStatus(400).end();
      return;
    }
    const tommorow = new Date();
    tommorow.setHours(tommorow.getHours() + 1);
    cacher.saveCache(value as ScrapedResult, tommorow);
    res.send(JSON.stringify(value));
    return;
  });

  app.get('/api/site', async (req, res) => {
    const query = req.query.kind;
    if (!siteNames.includes(query as SiteName)) {
      res.sendStatus(400).end();
      return;
    }
    const cacher = new Cacher<ScrapedResult>(query as string);
    const cache = cacher.getCache();
    if (cache) {
      res.send(JSON.stringify(cache));
      return;
    }

    const value = await cluster.execute({ site: query });
    if (!value) {
      res.sendStatus(400).end();
      return;
    }
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 1);
    cacher.saveCache(value as ScrapedResult, tommorow);
    res.send(JSON.stringify(value));
    return;
  });

  app.get('/api/magazine', async (req, res) => {
    const magazines = await todaysMagazines();
    res.send(JSON.stringify(magazines));
    return;
  });

  const port = 3000;
  console.log(`server listen ${port}`);
  app.listen(3000);
})();

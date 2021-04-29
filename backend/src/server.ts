import express from 'express';

import {
  createPuppeteerCluster,
  switchTwitterAccount,
  searchTweets,
} from './scraper';
import {
  IdleKind,
  idleKinds,
  Member,
  ScrapedResult,
  SiteName,
  siteNames,
} from './typing';
import { Cacher } from './cache';
import { todaysMagazines } from './magazine';
import { getMembers, getMemberTable } from './scraper-utils/wiki';

(async () => {
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
    const value = await searchTweets(account);
    if (!value) {
      res.sendStatus(400).end();
      return;
    }
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 1);
    cacher.saveCache(value as ScrapedResult, tomorrow);
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    cacher.saveCache(value as ScrapedResult, tomorrow);
    res.send(JSON.stringify(value));
    return;
  });

  app.get('/api/members', async (req, res) => {
    const kind = req.query.kind;
    if (!idleKinds.includes(kind as IdleKind)) {
      res.sendStatus(400).end();
      return;
    }
    const cacher = new Cacher<Member[]>(`${kind}-members`);
    const cache = cacher.getCache();
    if (cache) {
      res.send(JSON.stringify(cache));
      return;
    }
    const members: Member[] = await getMembers(kind as IdleKind);
    if (!members) {
      res.sendStatus(400).end();
      return;
    }
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 10);
    cacher.saveCache(members, tommorow);
    res.send(JSON.stringify(members));
    return;
  });

  app.get('/api/member-table', async (req, res) => {
    const kind = req.query.kind;
    if (!idleKinds.includes(kind as IdleKind)) {
      res.sendStatus(400).end();
      return;
    }
    const cacher = new Cacher<string[]>(`${kind}-member-table`);
    const cache = cacher.getCache();
    if (cache) {
      res.send(JSON.stringify(cache));
      return;
    }
    const tables: string[] = await getMemberTable(kind as IdleKind);
    if (!tables) {
      res.sendStatus(400).end();
      return;
    }
    const tommorow = new Date();
    tommorow.setDate(tommorow.getDate() + 10);
    cacher.saveCache(tables, tommorow);
    res.send(JSON.stringify(tables));
    return;
  });

  app.get('/api/magazines', async (req, res) => {
    const magazines = await todaysMagazines();
    res.send(JSON.stringify(magazines));
    return;
  });

  const port = 3000;
  console.log(`server listen ${port}`);
  app.listen(3000);
})();

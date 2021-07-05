import { Request, Response } from 'express';
import { Cacher, getCache } from '../cache';
import { scrape2 } from '../libs/scraper';
import { getBlogLinks2 } from '../libs/scraper-utils/links/blog';
import { getWikiLinks } from '../libs/scraper-utils/links/wiki';
import { memberTable } from '../libs/scraper-utils/wiki';
import {
  IdleKind,
  idleKinds,
  MemberLinks,
  ScrapedResult,
  SiteName,
  siteNames,
} from '../typing';

export const getSite = async (req: Request, res: Response) => {
  const query = req.query.kind;
  if (!siteNames.includes(query as SiteName)) {
    res.sendStatus(400).end();
    return;
  }
  const cacher = new Cacher<ScrapedResult>(query as string);
  const cache = await cacher.getCache();
  if (cache) {
    res.send(JSON.stringify(cache));
    return;
  }

  const value = await scrape2(query as SiteName);
  if (!value) {
    res.sendStatus(400).end();
    return;
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  await cacher.saveCache(value as ScrapedResult, tomorrow);
  res.send(JSON.stringify(value));
  return;
};

export const getMemberTable = async (req: Request, res: Response) => {
  const kind = req.query.kind;
  if (!idleKinds.includes(kind as IdleKind)) {
    res.sendStatus(400).end();
    return;
  }
  const cacher = new Cacher<string[]>(`${kind}-member-table`);
  const cache = await cacher.getCache();
  if (cache) {
    res.send(JSON.stringify(cache));
    return;
  }
  const tables: string[] = await memberTable(kind as IdleKind);
  if (!tables) {
    res.sendStatus(400).end();
    return;
  }
  const tommorow = new Date();
  tommorow.setDate(tommorow.getDate() + 10);
  await cacher.saveCache(tables, tommorow);
  res.send(JSON.stringify(tables));
  return;
};

export const getMemberLinks = async (req: Request, res: Response) => {
  const kind = req.query.kind;
  if (!idleKinds.includes(kind as IdleKind)) {
    res.sendStatus(400).end();
    return;
  }
  const tommorow = new Date();
  tommorow.setMonth(tommorow.getMonth() + 6);
  const cache = await getCache<MemberLinks[]>(
    `${kind}-member-link`,
    tommorow,
    async () => {
      const linksForSites = await Promise.all([
        getBlogLinks2(kind as IdleKind),
        getWikiLinks(kind as IdleKind),
      ]);
      const links: { [key: string]: string[] } = {};
      linksForSites.forEach((site) => {
        site
          .filter((nameLink) => !!nameLink.link)
          .forEach((nameLink) => {
            const link = nameLink.link as string;
            const targetName = nameLink.name.replace(/\s+/, '');
            if (!links[targetName]) {
              links[targetName] = [link];
            } else {
              links[targetName].push(link);
            }
          });
      });
      return Object.entries(links)
        .map(([name, links]) => {
          return { name, links } as MemberLinks;
        })
        .sort((a, b) => {
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        });
    }
  );
  if (cache) {
    res.send(JSON.stringify(cache));
    return;
  }
  res.sendStatus(500);
  return;
};

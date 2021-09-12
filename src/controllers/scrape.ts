import { Request, Response } from 'express';
import { Cacher, getCache } from '../cache';
import { scrape2 } from '../libs/scraper';
import { getBlogLinks2 } from '../libs/scraper-utils/links/blog';
import { getWikiLinks } from '../libs/scraper-utils/links/wiki';
import { wikiScrape } from '../libs/scraper-utils/wiki';
import {
  IdleKind,
  idleKinds,
  MemberLinks,
  ScrapedResult,
  SiteName,
  siteNames,
} from '../typing';

export const getSite = async (req: Request, res: Response) => {
  const kinds = req.query.kind as SiteName[];
  if (!kinds) {
    res.send(403).send('kind is required');
    return;
  }
  const invalidSites = kinds.filter((kind) => !siteNames.includes(kind));
  if (invalidSites.length > 0) {
    res.send(403).send(`Invalid kinds: ${invalidSites}`);
    return;
  }
  const response = await Promise.all(
    kinds.map(async (kind) => {
      const result = { kind, value: undefined };
      const cacher = new Cacher<ScrapedResult>(kind as string);
      const cache = await cacher.getCache();
      if (cache) {
        result.value = cache;
        return result;
      }

      const value = await scrape2(kind as SiteName);
      if (!value) {
        return result;
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await cacher.saveCache(value as ScrapedResult, tomorrow);
      result.value = value;
      return result;
    })
  );
  res.json(response);
  return;
};

export const getMemberTable = async (req: Request, res: Response) => {
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

      const cacher = new Cacher<object[][]>(`${kind}-wiki-member-table`);
      const cache = await cacher.getCache();
      if (cache) {
        result.value = cache;
        return result;
      }
      const value: object[][] = await wikiScrape(kind as IdleKind);
      if (!value) {
        return result;
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 10);
      await cacher.saveCache(value, tomorrow);
      result.value = value;
      return result;
    })
  );
  res.json(response);
  return;
};

export const getMemberLinks = async (req: Request, res: Response) => {
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
      const tomorrow = new Date();
      tomorrow.setMonth(tomorrow.getMonth() + 6);
      const cache = await getCache<MemberLinks[]>(
        `${kind}-member-link`,
        tomorrow,
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
      return { kind, value: cache };
    })
  );
  res.json(response);
  return;
};

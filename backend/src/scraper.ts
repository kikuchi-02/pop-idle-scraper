import { LaunchOptions, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import {
  IdleKind,
  Cache,
  ScrapedResult,
  SiteName,
  siteNames,
  idleKinds,
  Settings,
  Tweet,
} from './typing';
import {
  nogizakaKoshiki,
  sakurazakaKoshiki,
  hinatazakaKoshiki,
  nogizakaBlog,
  hinatazakaBlog,
  sakurazakaBlog,
} from './scraper-utils/sites';
import Twitter from 'twitter-v2';
import { formatDate, urlify } from './scraper-utils/utils';

const switchSite = (
  site: SiteName
): ((page: Page) => Promise<ScrapedResult>) => {
  switch (site) {
    case 'nogizaka-koshiki':
      return nogizakaKoshiki;
    case 'nogizaka-blog':
      return nogizakaBlog;
    case 'sakurazaka-koshiki':
      return sakurazakaKoshiki;
    case 'sakurazaka-blog':
      return sakurazakaBlog;
    case 'hinatazaka-koshiki':
      return hinatazakaKoshiki;
    case 'hinatazaka-blog':
      return hinatazakaBlog;
    default:
      throw Error(`not implemented type ${site}`);
  }
};

const switchTwitterAccount = (idle: IdleKind) => {
  switch (idle) {
    case 'nogizaka':
      return 'nogizaka46';
    case 'sakurazaka':
      return 'sakurazaka46';
    case 'hinatazaka':
      return 'hinatazaka46';
    default:
      throw Error(`not implemented type ${idle}`);
  }
};

export const scrape = async ({
  page,
  data: data,
}: {
  page: Page;
  data: { site: SiteName };
}): Promise<ScrapedResult> => {
  console.log(`start ${data.site}`);
  const scrapedResult = await switchSite(data.site)(page).catch((err) => {
    console.error(`got error while scraping: ${data.site}`);
    return { siteTitle: data.site } as ScrapedResult;
  });
  (scrapedResult.posts || []).forEach((post) => {
    if (post.date) {
      post.hDate = formatDate(post.date);
    }
  });
  console.log(`end ${data.site}`);
  return scrapedResult;
};

export const createPuppeteerCluster = async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    puppeteerOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ja-JA,ja'],
    } as LaunchOptions,
  });

  await cluster.task(scrape);
  return cluster;
};

export const scrapeAll = async (
  cluster: Cluster,
  kinds: IdleKind[]
): Promise<Cache> => {
  console.log('scraping now');
  const sites = siteNames.filter((site) =>
    kinds.some((kind) => site.startsWith(kind))
  );
  const scarpedResult = await Promise.all(
    sites.map((site) => cluster.execute({ site }))
  ).then((results) => {
    const cache: Cache = { date: Date.now() };
    kinds.forEach((kind) => {
      cache[kind] = [];
      sites.forEach((site, index) => {
        if (site.startsWith(kind)) {
          cache[kind]?.push(results[index]);
        }
      });
    });

    return cache;
  });
  console.log('scraping finish');
  return scarpedResult;
};

export const searchTweets = async (
  settings: Settings,
  account: string
): Promise<ScrapedResult> => {
  const twitterClient = new Twitter({
    bearer_token: settings.TWITTER_BEARER_TOKEN,
  });
  const response = await twitterClient
    .get('tweets/search/recent', {
      query: `from: "${account}"`,
      max_results: '10',
      tweet: {
        fields: ['created_at'],
      },
    })
    .catch((err) => {
      console.error(`got error while searching tweets: ${account}`);
    });
  if (!response) {
    return { siteTitle: account };
  }

  const tweets = (response as any).data.map((tweet: Tweet) => {
    const date = new Date(tweet.createdAt).getTime();
    const text = tweet.text
      .split('\n')
      .map((s) => s.trim())
      .join();
    const title = urlify(text);
    const hDate = formatDate(date);
    return { date, title, hDate };
  });
  return { siteTitle: account, posts: tweets };
};

export const searchTweetsAll = async (
  settings: Settings,
  idles: IdleKind[]
): Promise<Cache> => {
  console.log('searching tweets now');
  const searchedResult = await Promise.all(
    idles.map((idle) => searchTweets(settings, switchTwitterAccount(idle)))
  ).then((results) => {
    const cache: Cache = { date: Date.now() };
    idles.forEach((kind, index) => {
      cache[kind] = [results[index]];
    });
    return cache;
  });
  return searchedResult;
};

export const checkCache = async (
  cluster: Cluster,
  settings: Settings,
  scrapedCache: Cache,
  tweetCache: Cache
) => {
  const now = Date.now();

  const caches = await Promise.all([
    ((): Promise<Cache> => {
      if (scrapedCache && scrapedCache.date) {
        const diff = Math.floor((now - scrapedCache.date) / (1000 * 60 * 60));
        // 3 hours
        if (diff < 3) {
          return Promise.resolve(scrapedCache);
        }
      }
      return scrapeAll(cluster, [...idleKinds]);
    })(),
    ((): Promise<Cache> => {
      if (tweetCache && tweetCache.date) {
        const diff = Math.floor((now - tweetCache.date) / (1000 * 60 * 60));
        // 1 hour
        if (diff < 1) {
          return Promise.resolve(tweetCache);
        }
      }
      // return searchTweets(settings, [...idleKinds]);
      return searchTweetsAll(settings, [...idleKinds]);
    })(),
  ]);
  return { _scrapedCache: caches[0], _tweetCache: caches[1] };
};

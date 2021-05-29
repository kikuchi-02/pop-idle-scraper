import { LaunchOptions, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { IdleKind, ScrapedResult, SiteName, Settings, Tweet } from './typing';
import {
  nogizakaKoshiki,
  sakurazakaKoshiki,
  hinatazakaKoshiki,
  nogizakaBlog,
  hinatazakaBlog,
  sakurazakaBlog,
  nogizakaKoshiki2,
  nogizakaBlog2,
  sakurazakaKoshiki2,
  sakurazakaBlog2,
  hinatazakaKoshiki2,
  hinatazakaBlog2,
} from './scraper-utils/sites';
import Twitter from 'twitter-v2';
import { formatDate, urlify } from './scraper-utils/utils';
import { ENV_SETTINGS } from './conf';

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

const switchSite2 = (site: SiteName): (() => Promise<ScrapedResult>) => {
  switch (site) {
    case 'nogizaka-koshiki':
      return nogizakaKoshiki2;
    case 'nogizaka-blog':
      return nogizakaBlog2;
    case 'sakurazaka-koshiki':
      return sakurazakaKoshiki2;
    case 'sakurazaka-blog':
      return sakurazakaBlog2;
    case 'hinatazaka-koshiki':
      return hinatazakaKoshiki2;
    case 'hinatazaka-blog':
      return hinatazakaBlog2;
    default:
      throw Error(`not implemented type ${site}`);
  }
};

export const switchTwitterAccount = (idle: IdleKind) => {
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

export const scrape2 = async (site: SiteName): Promise<ScrapedResult> => {
  console.log(`start ${site}`);
  const scrapedResult = await switchSite2(site)().catch((err) => {
    console.error(`got error while scraping: ${site}, ${err}`);
    return { siteTitle: site } as ScrapedResult;
  });
  (scrapedResult.posts || []).forEach((post) => {
    if (post.date) {
      post.hDate = formatDate(post.date);
    }
  });
  console.log(`end ${site}`);
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

export const searchTweets = async (
  account: string
): Promise<ScrapedResult | undefined> => {
  let twitterClient;
  try {
    twitterClient = new Twitter({
      bearer_token: ENV_SETTINGS.TWITTER_BEARER_TOKEN,
    });
  } catch (e) {
    console.error('error around twitter keys', e);
    return undefined;
  }
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
      return undefined;
    });
  if (!response) {
    return { siteTitle: account };
  }

  const tweets = (response as any).data.map((tweet: Tweet) => {
    const date = new Date(tweet.created_at).getTime();
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

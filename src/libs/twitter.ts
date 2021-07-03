import Twitter from 'twitter-v2';
import { ENV_SETTINGS } from '../conf';
import { IdleKind, ScrapedResult, Tweet } from '../typing';
import { formatDate, urlify } from './scraper-utils/utils';

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
export const searchTweets = async (
  account: string
): Promise<ScrapedResult | undefined> => {
  if (!ENV_SETTINGS.TWITTER_BEARER_TOKEN) {
    return { siteTitle: account };
  }
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

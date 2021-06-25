export interface Post {
  date?: number;
  title?: string;
  link?: string;
  summary?: string;
  // generated
  hDate?: string;
}

export interface ScrapedResult {
  siteTitle?: string;
  posts?: Post[];
  // generated
  site?: string;
}

export const idleKinds = ['nogizaka', 'sakurazaka', 'hinatazaka'] as const;
export type IdleKind = typeof idleKinds[number];

export const siteNames = [
  'nogizaka-koshiki',
  // "nogizaka-anntena",
  'nogizaka-blog',
  'sakurazaka-koshiki',
  // "sakurazaka-anntena",
  'sakurazaka-blog',
  'hinatazaka-koshiki',
  'hinatazaka-blog',
] as const;
export type SiteName = typeof siteNames[number];

export interface Cache {
  date?: number;
  nogizaka?: ScrapedResult[];
  sakurazaka?: ScrapedResult[];
  hinatazaka?: ScrapedResult[];
}

export class Settings {
  TWITTER_API_KEY: string | undefined = undefined;
  TWITTER_API_SECRET_KEY: string | undefined = undefined;
  TWITTER_BEARER_TOKEN: string | undefined = undefined;
  TWITTER_ACCESS_TOKEN: string | undefined = undefined;
  TWITTER_ACCESS_TOKEN_SECRET: string | undefined = undefined;
  LINE_CHANNEL_ACCESS_TOKEN: string | undefined = undefined;
  DISCORD_URL: string | undefined = undefined;
  REDIS_HOST: string | undefined = undefined;
  REDIS_PORT: number | undefined = undefined;
  REDIS_PASSWORD: string | undefined = undefined;

  constructor(data: any) {
    Reflect.ownKeys(this).forEach((key) => {
      let v = data[key];
      if (v !== undefined && v !== null) {
        if (key === 'REDIS_PORT') {
          v = parseInt(v, 10);
        }
        Object.assign(this, { [key]: v });
      }
    });
  }
}

export interface Tweet {
  created_at: string;
  text: string;
}

export interface CacheValue<T> {
  value: T;
  expireDate: number | null;
}

export interface Member {
  name: string;
  kana: string;
  link: string;
}

export interface Magazine {
  title: string;
  link: string;
}

export interface BlogLink {
  name: string;
  link?: string;
}

export interface MemberLinks {
  name: string;
  links: string[];
}

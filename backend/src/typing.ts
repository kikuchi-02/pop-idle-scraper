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

export interface Settings {
  TWITTER_API_KEY: string;
  TWITTER_API_SECRET_KEY: string;
  TWITTER_BEARER_TOKEN: string;
  TWITTER_ACCESS_TOKEN: string;
  TWITTER_ACCESS_TOKEN_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
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
  link: string;
}

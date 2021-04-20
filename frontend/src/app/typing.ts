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

export const twitterAccounts = [
  'nogizaka-twitter',
  'sakurazaka-twitter',
  'hinatazaka-twitter',
] as const;
export type TwitterAccount = typeof twitterAccounts[number];

export interface Cache {
  date?: number;
  nogizaka?: ScrapedResult[];
  sakurazaka?: ScrapedResult[];
  hinatazaka?: ScrapedResult[];
}

export interface Tweet {
  createdAt: string;
  text: string;
}

export interface CacheValue<T> {
  value: T;
  expireDate: number | null;
}
export interface IdleSwitchState {
  nogizakaCheck: boolean;
  sakurazakaCheck: boolean;
  hinatazakaCheck: boolean;
}

export interface Member {
  name: string;
  link: string;
}

export interface Magazine {
  title: string;
  link: string;
}

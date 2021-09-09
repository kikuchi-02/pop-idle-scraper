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
  TWITTER: {
    API_KEY: string;
    API_SECRET: string;
    BEARER_TOKEN: string;
    ACCESS_TOKEN: string;
    ACCESS_TOKEN_SECRET: string;
  };
  LINE: {
    CHANNEL_ACCESS_TOKEN: string;
  };
  DISCORD: {
    URL: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
  };
  SALT_ROUND: number;
  DATABASE: {
    NAME: string;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
  };
  SECRET: string;
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

// from quill
export interface StringMap {
  [key: string]: any;
}
export interface OptionalAttributes {
  attributes?: StringMap;
}
export type DeltaOperation = {
  insert?: any;
  delete?: number;
  retain?: number;
} & OptionalAttributes;

// export enum ScriptStatus {
//   DONE = 'done',
//   WAIT_FOR_REVIEW = 'waitForReview',
//   REVIEWED = 'reviewed',
//   WIP = 'wip',
// }

export interface PaginationResponse<T> {
  data: T[];
  length: number;
  pageIndex: number;
  pageSize: number;
}

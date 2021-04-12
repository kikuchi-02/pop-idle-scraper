export interface Post {
  date?: number;
  title?: string;
  link?: string;
  summary?: string;
}

export interface ScrapedResult {
  siteTitle: string;
  posts: Post[];
  // generated
  site?: Site;
}

export type Site = "nogizaka" | "sakurazaka" | "hinatazaka";

export interface ScrapedCache {
  date?: number;
  sites: ScrapedResult[];
}

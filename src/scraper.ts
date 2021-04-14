import { LaunchOptions, Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import {
  IdleKind,
  ScrapedCache,
  ScrapedResult,
  SiteName,
  siteNames,
} from "./typing";
import {
  nogizakaKoshiki,
  sakurazakaKoshiki,
  hinatazakaKoshiki,
  nogizakaBlog,
  hinatazakaBlog,
  sakurazakaBlog,
} from "./scraper-utils/sites";

const formatDate = (_date: string | number): string => {
  const date = new Date(_date);
  const str =
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    `(${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`;
  return str;
};

const switchSite = (
  site: SiteName
): ((page: Page) => Promise<ScrapedResult>) => {
  switch (site) {
    case "nogizaka-koshiki":
      return nogizakaKoshiki;
    case "nogizaka-blog":
      return nogizakaBlog;
    case "sakurazaka-koshiki":
      return sakurazakaKoshiki;
    case "sakurazaka-blog":
      return sakurazakaBlog;
    case "hinatazaka-koshiki":
      return hinatazakaKoshiki;
    case "hinatazaka-blog":
      return hinatazakaBlog;
    default:
      throw Error(`not implemented type ${site}`);
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
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ja-JA,ja"],
    } as LaunchOptions,
  });

  await cluster.task(scrape);
  return cluster;
};

export const scrapeAll = async (
  cluster: Cluster,
  kinds: IdleKind[]
): Promise<ScrapedCache> => {
  console.log("scraping now");
  const sites = siteNames.filter((site) =>
    kinds.some((kind) => site.startsWith(kind))
  );
  const scarpedResult = await Promise.all(
    sites.map((site) => cluster.execute({ site }))
  ).then((results) => {
    const cache: ScrapedCache = { date: Date.now() };
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
  console.log("scraping finish");
  return scarpedResult;
};

import { launch, LaunchOptions, Page } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import { writeFile } from "fs";
import { ScrapedResult, Site } from "./typing";
import {
  nogizakaFeed,
  sakurazakaFeed,
  hinatazakaFeed,
} from "./scraper-utils/sites";

export const scrape = async ({
  page,
  data: data,
}: {
  page: Page;
  data: { site: Site };
}): Promise<ScrapedResult> => {
  switch (data.site) {
    case "nogizaka":
      return await nogizakaFeed(page);
    case "hinatazaka":
      return await hinatazakaFeed(page);
    case "sakurazaka":
      return await sakurazakaFeed(page);
    default:
      throw Error(`not implemented type ${data.site}`);
  }
};

export const createPuppeteerCluster = async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    puppeteerOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    } as LaunchOptions,
  });

  await cluster.task(scrape);
  return cluster;
};

export const scrapeAll = async (
  cluster: Cluster,
  sites: Site[]
): Promise<ScrapedResult[]> => {
  return await Promise.all(
    sites.map((site) =>
      cluster.execute({ site }).then((result: ScrapedResult) => {
        result.posts = result.posts.slice(0, 10);
        return result;
      })
    )
  );
};

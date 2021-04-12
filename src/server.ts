import express from "express";
import { Request, Response } from "express";
import { join } from "path";
import { readFileSync, constants, accessSync } from "fs";

import { scrape, createPuppeteerCluster, scrapeAll } from "./scraper";
import { Site, ScrapedCache } from "./typing";

(async () => {
  const app = express();
  const cluster = await createPuppeteerCluster();

  app.set("views", join(process.cwd(), "views"));
  app.set("view engine", "ejs");

  app.use(express.static("assets"));

  app.get("*", (req, res, next) => {
    console.log("request", req.path);
    next();
  });

  // const readJson = async (idle: Site): Promise<string> => {
  //   const uri = join(process.cwd(), "scraped", idle + ".json");
  //   accessSync(uri, constants.R_OK);
  //   const data = readFileSync(uri, { encoding: "utf-8" });
  //   return JSON.parse(data);
  // };

  // const cache: ScrapedCache = await Promise.all(cluster.execute({siteTitle: 'sakurazaka'}))

  const sites: Site[] = ["nogizaka", "hinatazaka", "sakurazaka"];
  let cache: ScrapedCache = await scrapeAll(cluster, sites).then(
    (results) => {
      return { date: Date.now(), sites: Object.values(results) };
    }
  );

  app.get("/", async (req: Request, res: Response) => {
    if (cache.date) {
      const now = Date.now();
      const diff = Math.floor((now - cache.date) / (1000 * 60 * 60 * 24));
      if (diff < 1) {
        res.render("index", {
          sites: cache.sites,
        });
        res.end();
        return;
      }
    }

    cache = await scrapeAll(cluster, sites).then(
      (results) => {
        return { date: Date.now(), sites: Object.values(results) };
      }
    );
    res.render("index", {
      sites: cache.sites,
    });
    res.end();
    return;
  });

  const port = 3000;
  console.log(`server listen ${port}`);
  app.listen(3000);
})();

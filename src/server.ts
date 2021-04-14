import express from "express";
import { Request, Response } from "express";
import { join } from "path";
import { readFileSync, constants, accessSync, writeFileSync } from "fs";

import { scrape, createPuppeteerCluster, scrapeAll } from "./scraper";
import { SiteName, ScrapedCache, ScrapedResult, idleKinds } from "./typing";

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

  let cache: ScrapedCache = await scrapeAll(cluster, [...idleKinds]);

  app.get("__refresh", async (req: Request, res: Response) => {
    cache = await scrapeAll(cluster, [...idleKinds]);
    res.render("index", { cache, kinds: idleKinds });
  });

  // app.get("/nogizaka", async (req: Request, res: Response) => {
  //   const ca = await scrapeAll(cluster, ["nogizaka"]);
  //   res.render("index", { cache: ca, kinds: ["nogizaka"] });
  // });

  app.get("/", async (req: Request, res: Response) => {
    if (cache && cache.date) {
      const now = Date.now();
      const diff = Math.floor((now - cache.date) / (1000 * 60 * 60 * 24));
      if (diff < 1) {
        res.render("index", {
          cache,
          kinds: idleKinds,
        });
        res.end();
        return;
      }
    }

    cache = await scrapeAll(cluster, [...idleKinds]);
    res.render("index", {
      cache,
      kinds: idleKinds,
    });
    res.end();
    return;
  });

  const port = 3000;
  console.log(`server listen ${port}`);
  app.listen(3000);
})();

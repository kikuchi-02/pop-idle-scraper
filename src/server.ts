import express from "express";
import { Request, Response } from "express";
import { join } from "path";
import { readFileSync } from "fs";

import { createPuppeteerCluster, checkCache } from "./scraper";
import { Cache, idleKinds, Settings } from "./typing";
import * as yaml from "js-yaml";

(async () => {
  const settings = yaml.load(readFileSync("envs.yaml", "utf-8")) as Settings;

  const app = express();
  const cluster = await createPuppeteerCluster();

  app.set("views", join(process.cwd(), "views"));
  app.set("view engine", "ejs");

  app.use(express.static("assets"));

  app.get("*", (req, res, next) => {
    console.log("request", req.path);
    next();
  });

  let scrapedCache = {} as Cache;
  let tweetCache = {} as Cache;

  app.get("/", async (req: Request, res: Response) => {
    const { _scrapedCache, _tweetCache } = await checkCache(
      cluster,
      settings,
      scrapedCache,
      tweetCache
    );
    scrapedCache = _scrapedCache;
    tweetCache = _tweetCache;

    res.render("index", {
      scrapedCache,
      tweetCache,
      kinds: idleKinds,
    });
    res.end();
    return;
  });

  const port = 3000;
  console.log(`server listen ${port}`);
  app.listen(3000);
})();

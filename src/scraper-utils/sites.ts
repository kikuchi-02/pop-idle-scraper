import { Page } from "puppeteer";
import { Post, ScrapedResult } from "../typing";

export const nogizakaFeed = async (page: Page): Promise<ScrapedResult> => {
  const url = "http://www.nogizaka46.com/news/";
  await page.goto(url, { waitUntil: "networkidle2" });
  // ja
  await page
    .click("#wovn-translate-widget > div.wovn-lang-selector")
    .then(() => {
      return page.click(
        "#wovn-translate-widget > div.wovn-lang-container > ul > li:nth-child(1)"
      );
    })
    .catch((e) => {});

  const posts = await page.$$eval("#N0 > div.padding > ul > li", (elements) => {
    return elements.map((elm) => {
      const obj: Post = {};
      const title = elm.querySelector(".title")?.textContent;
      if (title) {
        obj.title = title;
      }
      const summary = (elm.querySelector(".summary")?.textContent || "")
        .split("\n")
        .reduce((p, c) => {
          c = c.trim();
          if (c) {
            p += c;
          }
          return p;
        }, "");
      if (summary) {
        obj.summary = summary;
      }
      const date = elm.querySelector(".date")?.textContent;
      if (date) {
        obj.date = Date.parse(date);
      }
      const link = elm.querySelector("a")?.getAttribute("href");
      if (link) {
        obj.link = link;
      }

      return obj;
    });
  });

  const siteTitle = await page.title();
  return { siteTitle, posts };
};

export const sakurazakaFeed = async (page: Page): Promise<ScrapedResult> => {
  const url = "https://sakurazaka46.com";
  await page.goto(url, { waitUntil: "networkidle2" });
  const newsPath = await page.$eval(
    "#page-top > header > div.inner.fxpc > nav > div > ul:nth-child(1) > li:nth-child(3) > a",
    (elm) => {
      return elm.getAttribute("href");
    }
  );
  if (!newsPath) {
    return Promise.reject();
  }
  await page.goto(url + newsPath, { waitUntil: "networkidle2" });

  const posts = await page.$$eval(
    "#cate-news > main > div.col2-wrap.wid1200 > div.col-r > ul > li",
    (elements) => {
      return elements.map((elm) => {
        const obj: Post = {};
        const link = elm.querySelector("a")?.getAttribute("href");
        if (link) {
          obj.link = link.startsWith("/")
            ? "https://sakurazaka46.com" + link
            : link;
        }
        const date = elm.querySelector(".date")?.textContent;
        if (date) {
          obj.date = Date.parse(date);
        }
        const title = elm.querySelector(".lead")?.textContent;
        if (title) {
          obj.title = title;
        }
        return obj;
      });
    }
  );
  const siteTitle = await page.title();
  return { siteTitle, posts };
};

export const hinatazakaFeed = async (page: Page): Promise<ScrapedResult> => {
  const url = "https://www.hinatazaka46.com";

  await page.goto(url, { waitUntil: "networkidle2" });
  const newsPath = await page.$eval(
    "body > div > div.l-header > div > header > nav > ul > li:nth-child(1) > a",
    (elm) => {
      return elm.getAttribute("href");
    }
  );
  if (!newsPath) {
    return Promise.reject();
  }
  await page.goto(url + newsPath, { waitUntil: "networkidle2" });

  const posts = await page.$$eval(
    "body > div > main > section > div > div.l-contents > div.l-maincontents--news > ul > li",
    (elements) => {
      return elements.map((elm) => {
        const obj: Post = {};
        const link = elm.querySelector("a")?.getAttribute("href");
        if (link) {
          obj.link = link.startsWith("/")
            ? "https://www.hinatazaka46.com" + link
            : link;
        }
        const date = elm.querySelector(".c-news__date")?.textContent;
        if (date) {
          obj.date = Date.parse(date);
        }

        const title = (elm.querySelector(".c-news__text")?.textContent || "")
          .split("\n")
          .reduce((p, c) => {
            c = c.trim();
            if (c) {
              p += c;
            }
            return p;
          }, "");
        if (title) {
          obj.title = title;
        }
        return obj;
      });
    }
  );
  const siteTitle = await page.title();

  return { siteTitle, posts };
};

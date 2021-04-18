import { Page } from 'puppeteer';
import { Post, ScrapedResult } from '../typing';
import { setLanguage } from './utils';

const defaultLimit = 7;

export const nogizakaKoshiki = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'http://www.nogizaka46.com/news/';

  await setLanguage(page);
  await page.goto(url, { waitUntil: 'networkidle2' });

  const posts = await page
    .$$eval('#N0 > div.padding > ul > li', (elements) => {
      return elements.map((elm) => {
        const obj: Post = {};
        const title = elm.querySelector('.title')?.textContent;
        if (title) {
          obj.title = title;
        }
        const summary = (elm.querySelector('.summary')?.textContent || '')
          .split('\n')
          .reduce((p, c) => {
            c = c.trim();
            if (c) {
              p += c;
            }
            return p;
          }, '');
        if (summary) {
          obj.summary = summary;
        }
        const date = elm.querySelector('.date')?.textContent;
        if (date) {
          obj.date = new Date(date).getTime();
        }
        const link = elm.querySelector('a')?.getAttribute('href');
        if (link) {
          obj.link = link;
        }

        return obj;
      });
    })
    .then((_posts) => _posts.slice(0, limit));

  const siteTitle = await page.title();
  return { siteTitle, posts };
};

export const nogizakaBlog = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'http://blog.nogizaka46.com/';

  await page.goto(url, { waitUntil: 'networkidle2' });

  const heads = await page.$$('#sheet > h1');
  const bodies = await page.$$('#sheet > div[class=entrybody]');
  const posts: Post[] = [];
  for (let index = 0; index < heads.length; index++) {
    const { date, author, title, link } = await page.evaluate((elm) => {
      const yearmonth = elm
        .querySelector('.yearmonth')
        ?.textContent?.split('/');
      const _date = elm.querySelector('.dd1')?.textContent;

      let date;
      if (yearmonth && _date) {
        date = new Date(
          parseInt(yearmonth[0], 10),
          parseInt(yearmonth[1], 10) - 1,
          parseInt(_date)
        ).getTime();
      }

      const author = elm.querySelector('.author')?.textContent;
      const title = elm.querySelector('.entrytitle')?.textContent;
      const link = elm.querySelector('.entrytitle > a')?.getAttribute('href');
      return { date, author, title, link };
    }, heads[index]);

    const body = await page.evaluate((elm) => {
      return elm?.textContent
        .split('\n')
        .reduce((acc: string, curr: string) => {
          curr = curr.trim();
          if (curr) {
            acc += curr;
          }
          return acc;
        }, '')
        .slice(0, 200);
    }, bodies[index]);

    posts.push({
      title: `${title}(${author})`,
      summary: body,
      date,
      link,
    });
    if (posts.length >= limit) {
      break;
    }
  }

  const siteTitle = await page.title();

  return { siteTitle, posts };
};

export const sakurazakaKoshiki = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'https://sakurazaka46.com';
  await page.goto(url, { waitUntil: 'networkidle2' });
  const newsPath = await page.$eval(
    '#page-top > header > div.inner.fxpc > nav > div > ul:nth-child(1) > li:nth-child(3) > a',
    (elm) => {
      return elm.getAttribute('href');
    }
  );
  if (!newsPath) {
    return Promise.reject(Error('path not found'));
  }
  await page.goto(url + newsPath, { waitUntil: 'networkidle2' });

  const posts = await page
    .$$eval(
      '#cate-news > main > div.col2-wrap.wid1200 > div.col-r > ul > li',
      (elements) => {
        return elements.map((elm) => {
          const obj: Post = {};
          const link = elm.querySelector('a')?.getAttribute('href');
          if (link) {
            obj.link = link.startsWith('/')
              ? 'https://sakurazaka46.com' + link
              : link;
          }
          const date = elm.querySelector('.date')?.textContent;
          if (date) {
            obj.date = new Date(date).getTime();
          }
          const title = elm.querySelector('.lead')?.textContent;
          if (title) {
            obj.title = title;
          }
          return obj;
        });
      }
    )
    .then((_posts) => _posts.slice(0, limit));
  const siteTitle = await page.title();
  return { siteTitle, posts };
};

export const sakurazakaBlog = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'https://sakurazaka46.com/s/s46/diary/blog/list';

  await page.goto(url, { waitUntil: 'networkidle2' });
  const posts = await page
    .$$eval('#cate-blog > main > div:nth-child(3) > ul > li', (elements) => {
      return elements.map((elm) => {
        const post: Post = {};
        const title = elm.querySelector('.title')?.textContent;
        const author = elm.querySelector('.name')?.textContent;
        post.title = `${title}(${author})`;
        const link = elm.querySelector('a')?.getAttribute('href');
        if (link) {
          post.link = `https://sakurazaka46.com${link}`;
        }
        const date = elm.querySelector('.date')?.textContent;
        if (date) {
          post.date = new Date(date).getTime();
        }
        const summary = elm.querySelector('.lead')?.textContent;
        if (summary) {
          post.summary = summary
            .split('\n')
            .reduce((acc: string, curr: string) => {
              curr = curr.trim();
              if (curr) {
                acc += curr;
              }
              return acc;
            }, '')
            .slice(0, 200);
        }
        return post;
      });
    })
    .then((_posts) => _posts.slice(0, limit));
  const siteTitle = await page.title();
  return { siteTitle, posts };
};

export const hinatazakaKoshiki = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'https://www.hinatazaka46.com';

  await page.goto(url, { waitUntil: 'networkidle2' });
  const newsPath = await page.$eval(
    'body > div > div.l-header > div > header > nav > ul > li:nth-child(1) > a',
    (elm) => {
      return elm.getAttribute('href');
    }
  );
  if (!newsPath) {
    return Promise.reject(Error('not found'));
  }
  await page.goto(url + newsPath, { waitUntil: 'networkidle2' });

  const posts = await page
    .$$eval(
      'body > div > main > section > div > div.l-contents > div.l-maincontents--news > ul > li',
      (elements) => {
        return elements.map((elm) => {
          const obj: Post = {};
          const link = elm.querySelector('a')?.getAttribute('href');
          if (link) {
            obj.link = link.startsWith('/')
              ? 'https://www.hinatazaka46.com' + link
              : link;
          }
          const date = elm.querySelector('.c-news__date')?.textContent;
          if (date) {
            obj.date = new Date(date).getTime();
          }

          const title = (elm.querySelector('.c-news__text')?.textContent || '')
            .split('\n')
            .reduce((p, c) => {
              c = c.trim();
              if (c) {
                p += c;
              }
              return p;
            }, '');
          if (title) {
            obj.title = title;
          }
          return obj;
        });
      }
    )
    .then((_posts) => _posts.slice(0, limit));
  const siteTitle = await page.title();

  return { siteTitle, posts };
};

export const hinatazakaBlog = async (
  page: Page,
  limit = defaultLimit
): Promise<ScrapedResult> => {
  const url = 'https://www.hinatazaka46.com/s/official/diary/member';
  await page.goto(url, { waitUntil: 'networkidle2' });

  const posts = await page
    .$$eval(
      'body > div > main > section > div > div.l-contents > div.l-maincontents.l-maincontents--100 > div.p-blog-top__contents > ul > li',
      (elements) => {
        return elements.map((elm) => {
          const post: Post = {};
          const title = elm
            .querySelector('.c-blog-top__title')
            ?.textContent?.trim();
          const author = elm
            .querySelector('.c-blog-top__name')
            ?.textContent?.trim();
          post.title = `${title}(${author})`;
          const link = elm.querySelector('a')?.getAttribute('href');
          if (link) {
            post.link = `https://www.hinatazaka46.com${link}`;
          }
          const date = elm.querySelector('.c-blog-top__date')?.textContent;
          if (date) {
            post.date = new Date(date).getTime();
          }
          return post;
        });
      }
    )
    .then((_posts) => _posts.slice(0, limit));
  const siteTitle = await page.title();
  return { siteTitle, posts };
};

import { Page } from 'puppeteer';
import { BlogLink } from '../typing';

export const nogizakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
  const url = 'https://blog.nogizaka46.com';
  await page.goto(url, { waitUntil: 'networkidle0' });
  const baseUrl = await page.evaluate(() => {
    return window.location.origin;
  });

  const members = await page.$$('#sidemember > div.clearfix > div.unit');
  return Promise.all(
    members.map(async (member) => {
      return page
        .evaluate((elm) => {
          const name = elm.querySelector('.kanji').textContent;
          let link = elm.querySelector('a').getAttribute('href');
          return { name, link };
        }, member)
        .then((m) => {
          m.link = baseUrl + m.link;
          return m;
        });
    })
  );
};

export const sakurazakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
  const url = 'https://sakurazaka46.com/s/s46/diary/blog/list';
  await page.goto(url, { waitUntil: 'networkidle0' });
  const baseUrl = await page.evaluate(() => {
    return window.location.origin;
  });

  const members = await page.$$(
    '#cate-blog > main > div:nth-child(3) > div.btn-wrap > div > div > div > form > select > option'
  );
  return Promise.all(
    members.map(async (member) => {
      return page.evaluate((elm) => {
        const name = elm.textContent;
        let link = elm.getAttribute('value');
        return { name, link };
      }, member);
    })
  ).then((_members) => {
    return _members
      .filter((m) => m.name && m.link)
      .map((m) => {
        m.name = m.name.slice(0, m.name.indexOf('('));
        m.link = baseUrl + m.link;
        return m;
      });
  });
};

export const hinatazakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
  const url = 'https://www.hinatazaka46.com/s/official/diary/member/list';
  await page.goto(url, { waitUntil: 'networkidle0' });
  const baseUrl = await page.evaluate(() => {
    return window.location.origin;
  });

  const members = await page.$$(
    'body > div > main > section > div > div.l-contents.l-contents--blog-list > div.l-sub-contents--blog > div > div.p-blog-member-filter > div > form > select > option'
  );
  return Promise.all(
    members.map(async (member) => {
      return page.evaluate((elm) => {
        const name = elm.textContent;
        let link = elm.getAttribute('value');
        return { name, link };
      }, member);
    })
  ).then((_members) => {
    return _members
      .filter((m) => m.name && m.link)
      .map((m) => {
        m.name = m.name.slice(0, m.name.indexOf('('));
        m.link = baseUrl + m.link;
        return m;
      });
  });
};

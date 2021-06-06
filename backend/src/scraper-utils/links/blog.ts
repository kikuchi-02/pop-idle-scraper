import axios from 'axios';
import { parseHtml, Element } from 'libxmljs2';
import { Page } from 'puppeteer';
import { BlogLink, IdleKind } from '../../typing';

const getBaseUrl = (url: string) => {
  const u = new URL(url);
  return u.protocol + '//' + u.host;
};

const nogizakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
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
          if (link.startsWith('./')) {
            link = link.slice(1);
          }
          return { name, link };
        }, member)
        .then((m) => {
          m.link = baseUrl + m.link;
          return m;
        });
    })
  );
};

const nogizakaBlogLinks2 = async (): Promise<BlogLink[]> => {
  const url = 'https://blog.nogizaka46.com';
  const response = await axios.get(url);
  const htmlString = response.data;
  const html = parseHtml(htmlString);

  const members = html.get('//*[@id="sidemember"]/div[@class="clearfix"]');

  return (members as Element)
    .childNodes()
    .filter(
      (node) => node.type() === 'element' && (node as Element).name() === 'div'
    )
    .map((node) => {
      const _name = (node as Element).get('*/span[@class="kanji"]');
      const name = (_name as Element).text();

      const anchor = (node as Element).get('a');
      let link = (anchor as Element).attr('href')?.value();
      if (link?.startsWith('./')) {
        link = url + link.slice(1);
      }

      return { name, link };
    });
};

const sakurazakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
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
        if (link.startsWith('./')) {
          link = link.slice(1);
        }
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

const sakurazakaBlogLinks2 = async (): Promise<BlogLink[]> => {
  const url = 'https://sakurazaka46.com/s/s46/diary/blog/list';
  const response = await axios.get(url);
  const htmlString = response.data;
  const html = parseHtml(htmlString);

  const members = html.get('//select');

  return (members as Element)
    .childNodes()
    .filter(
      (node) =>
        node.type() === 'element' &&
        (node as Element).name() === 'option' &&
        (node as Element).attr('value')?.value()
    )
    .map((node) => {
      let name = (node as Element).text();
      name = name.slice(0, name.indexOf('('));

      let link = (node as Element).attr('value')?.value();
      if (link?.startsWith('/')) {
        link = getBaseUrl(url) + link;
      }

      return { name, link };
    });
};

const hinatazakaBlogLinks = async (page: Page): Promise<BlogLink[]> => {
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
        if (link.startsWith('./')) {
          link = link.slice(1);
        }
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

const hinatazakaBlogLinks2 = async (): Promise<BlogLink[]> => {
  const url = 'https://www.hinatazaka46.com/s/official/diary/member/list';
  const response = await axios.get(url);
  const htmlString = response.data;
  const html = parseHtml(htmlString);

  const members = html.get('//select');

  return (members as Element)
    .childNodes()
    .filter(
      (node) =>
        node.type() === 'element' &&
        (node as Element).name() === 'option' &&
        (node as Element).attr('value')?.value()
    )
    .map((node) => {
      let name = (node as Element).text();
      name = name.slice(0, name.indexOf('('));

      let link = (node as Element).attr('value')?.value();
      if (link?.startsWith('/')) {
        link = getBaseUrl(url) + link
      }

      return { name, link };
    });
};

export const getBlogLinks = (
  page: Page,
  kind: IdleKind
): Promise<BlogLink[]> => {
  switch (kind) {
    case 'nogizaka':
      return nogizakaBlogLinks(page);
    case 'hinatazaka':
      return hinatazakaBlogLinks(page);
    case 'sakurazaka':
      return sakurazakaBlogLinks(page);
    default:
      throw Error('not valid kind');
  }
};

export const getBlogLinks2 = (kind: IdleKind): Promise<BlogLink[]> => {
  switch (kind) {
    case 'nogizaka':
      return nogizakaBlogLinks2();
    case 'hinatazaka':
      return hinatazakaBlogLinks2();
    case 'sakurazaka':
      return sakurazakaBlogLinks2();
    default:
      throw Error('not valid kind');
  }
};

import axios from 'axios';
import cheerio from 'cheerio';
import { Element, parseHtml } from 'libxmljs2';
import { IdleKind } from '../../typing';
import { switchWikiLink } from './links/wiki';

const formatTable = (element: Element): Element => {
  element.childNodes().forEach((node) => {
    if (node.type() === 'element') {
      if ((node as Element).name() === 'a') {
        (node as Element).attr('target', '_blank');
      }
      const style = (node as Element).attr('style');
      if (style && /display:none/.test(style.value())) {
        node.remove();
      }
      if (node) {
        node = formatTable(node as Element);
      }
    }
  });
  return element;
};

export const extractExternalLinks = (htmlString: string) => {
  const links: string[] = [];
  const html = parseHtml(htmlString);
  const h2 = html.get('//*[@id="外部リンク"]');
  // console.log(h2?.parent().toString())
  // console.log((h2?.parent() as Element).nextSibling()?.toString())
  let sibling = (h2?.parent() as Element).nextSibling();
  while (true) {
    if ((sibling as Element).name() === 'ul') {
      break;
    }
    sibling = sibling?.nextSibling() || null;
  }
  if (sibling) {
    (sibling as Element)
      .childNodes()
      .filter((li) => li.type() === 'element')
      .forEach((li) => {
        (li as Element)
          .childNodes()
          .filter((a) => (a as Element).name() === 'a')
          .slice(0, 1)
          .forEach((a) => {
            const href = (a as Element).attr('href')?.value();
            if (href) {
              links.push(href);
            }
          });
      });
  }
  return links;
};

export const memberTable = async (idle: IdleKind): Promise<string[]> => {
  const baseUrl = 'https://ja.wikipedia.org';
  const url = baseUrl + switchWikiLink(idle);
  const homeResponse = await axios.get(url);
  if (homeResponse.status !== 200) {
    return Promise.reject(Error(`status ${homeResponse.status}`));
  }

  const urlReplacer = (match: string, p: string) => {
    return match.replace(p, baseUrl + p);
  };

  const tables: string[] = [];
  const html = parseHtml(homeResponse.data);
  const membersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[2]');
  if (membersTable?.type() === 'element') {
    tables.push(
      formatTable(membersTable as Element)
        .toString()
        .replace(/href="(.[^"]*)/g, urlReplacer)
    );
  }
  const oldMembersTable = html.get(
    '//*[@id="mw-content-text"]/div[1]/table[3]'
  );
  if (oldMembersTable?.type() === 'element') {
    tables.push(
      formatTable(oldMembersTable as Element)
        .toString()
        .replace(/href="(.[^"]*)/g, urlReplacer)
    );
  }
  return tables;
};

export const wikiScrape = async (idle: IdleKind): Promise<object[][]> => {
  const baseUrl = 'https://ja.wikipedia.org';
  const url = baseUrl + switchWikiLink(idle);
  const homeResponse = await axios.get(url);
  if (homeResponse.status !== 200) {
    return Promise.reject(Error(`status ${homeResponse.status}`));
  }

  const htmlString = homeResponse.data;

  const $ = cheerio.load(htmlString);
  const h2 = $('#content')
    .find('h2')
    .toArray()
    .find((header) => $(header).text().startsWith('メンバー'));
  const tables = $(h2).nextAll('table').toArray().slice(0, 2);
  const parsed = tables.map((table) => {
    const columns = $(table)
      .find('tr > th')
      .toArray()
      .map((th) => $(th).text().trim());

    const rows = $(table)
      .find('tbody > tr')
      .toArray()
      .map((tr) => $(tr).find('td').toArray())
      .filter((row) => row.length === columns.length)
      .map((tr) => {
        const link = $(tr[0]).find('a').attr('href');
        const row = tr.map((td) => {
          return $(td).text().trim();
        });
        const result = columns.reduce((acc, column, i) => {
          if (/^(\d{4}\/\d{2}\/\d{2}).*$/.test(row[i])) {
            acc[column] = new Date(
              row[i].replace(/^(\d{4}\/\d{2}\/\d{2}).*$/, (match, p) => p)
            );
          } else {
            acc[column] = row[i];
          }
          return acc;
        }, {});
        if (link) {
          result['link'] = baseUrl + link;
        }
        return result;
      });
    return rows;
  });
  return parsed;
};

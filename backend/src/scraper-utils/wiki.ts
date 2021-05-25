import axios from 'axios';

import { parseHtml, Element } from 'libxmljs2';
import { IdleKind } from '../typing';
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

export const getMemberTable = async (idle: IdleKind): Promise<string[]> => {
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

import axios from 'axios';
import { parseHtml, Element } from 'libxmljs2';
import { Page } from 'puppeteer';
import { BlogLink, IdleKind } from '../../typing';

export const switchWikiLink = (idle: IdleKind): string => {
  switch (idle) {
    case 'nogizaka':
      return '/wiki/%E4%B9%83%E6%9C%A8%E5%9D%8246#%E3%83%A1%E3%83%B3%E3%83%90%E3%83%BC';
      break;
    case 'sakurazaka':
      return '/wiki/%E6%AB%BB%E5%9D%8246';
      break;
    case 'hinatazaka':
      return '/wiki/%E6%97%A5%E5%90%91%E5%9D%8246';
      break;
    default:
      throw Error(`not impletemnetd type ${idle}`);
  }
};


const parseTable = (membersTable: Element): string[][] => {
  const members: string[][] = [];
  membersTable
    .childNodes()
    .filter((node) => (node as Element).name() === 'tr')
    .forEach((node) => {
      (node as Element)
        .childNodes()
        .filter((td) => (td as Element).name() === 'td')
        .slice(0, 1)
        .forEach((td) => {
          const anchor = (td as Element).child(0);
          const name = (td as Element).text();
          if ((anchor as Element).name() === 'a') {
            const href = (anchor as Element).attr('href')?.value();
            if (href) {
              members.push([name, href]);
              return;
            }
          }
          members.push([name]);
        });
    });
  return members;
};

const extractMembers = (htmlString: string) => {
  const members: string[][] = [];
  const html = parseHtml(htmlString);
  const membersTable = html.get(
    '//*[@id="mw-content-text"]/div[1]/table[2]/tbody'
  );
  if (membersTable?.type() === 'element') {
    members.push(...parseTable(membersTable as Element));
  }
  const oldMembersTable = html.get(
    '//*[@id="mw-content-text"]/div[1]/table[3]/tbody'
  );
  if (oldMembersTable?.type() === 'element') {
    members.push(...parseTable(oldMembersTable as Element));
  }
  return members;
};

export const getWikiLinks = async (idle: IdleKind): Promise<BlogLink[]> => {
  const baseUrl = 'https://ja.wikipedia.org';
  const url = baseUrl + switchWikiLink(idle);

  const homeResponse = await axios.get(url);
  if (homeResponse.status !== 200) {
    return Promise.reject(Error(`status ${homeResponse.status}`));
  }

  const members = extractMembers(homeResponse.data).map((member) => {
    return {
      name: member[0],
      link: member[1] ? baseUrl + member[1] : undefined,
    } as BlogLink;
  });
  return members;
  // const json: any = await Promise.all(members.map(async (member) => {
  //   if (member.length > 1) {
  //     const url = baseUrl + member[1]

  //     try {
  //       const response = await axios.get(url)
  //       if (response.status !== 200){
  //         throw Error(`request failed with status: ${response.status}, url: ${url}`)
  //       }
  //       const links = extractExternalLinks(response.data as string)
  //       return [member[0], links];
  //     } catch (e) {
  //       return [member[0], e];
  //     }
  //   } else {
  //     return [member[0]];
  //   }
  // }))
  // return json
};

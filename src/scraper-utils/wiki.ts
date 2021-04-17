import axios from 'axios';

import { parseHtml, Element } from 'libxmljs2';
import { IdleKind } from "../typing";


const parseTable = (membersTable: Element): string[][] => {
    const members: string[][] = [];
    membersTable.childNodes().filter((node) =>
        (node as Element).name() === 'tr'
    ).forEach((node) => {
        (node as Element).childNodes().filter((td) =>
            (td as Element).name() === 'td'
        ).slice(0, 1).forEach((td) => {
            const anchor = (td as Element).child(0)
            const name = (td as Element).text();
            if ((anchor as Element).name() === 'a') {
                const href = (anchor as Element).attr('href')?.value();
                if (href) {
                    members.push([name, href])
                    return;
                }
            }
            members.push([name])
        })
    })
    return members
}


const extractMembers = (htmlString: string) => {
    const members: string[][] = [];
    const html = parseHtml(htmlString)
    const membersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[2]/tbody')
    if (membersTable?.type() === 'element') {
        members.push(...parseTable(membersTable as Element))
    }
    const oldMembersTable = html.get('//*[@id="mw-content-text"]/div[1]/table[3]/tbody')
    if (oldMembersTable?.type() === 'element') {
        members.push(...parseTable(oldMembersTable as Element))
    }
    return members;
}

const extractExternalLinks = (htmlString: string) => {
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
        (sibling as Element).childNodes().filter((li) => li.type() === 'element').forEach((li) => {
            (li as Element).childNodes().filter((a) => (a as Element).name() === 'a').slice(0, 1).forEach((a) => {
                const href = (a as Element).attr('href')?.value();
                if (href) {
                    links.push(href);
                }
            })
        })
    }
    return links
}

export const getMembers = async (idle: IdleKind) => {
    const baseUrl = 'https://ja.wikipedia.org';
    let url = baseUrl;
    switch (idle) {
        case 'nogizaka':
            const nogizakaHome = '/wiki/%E4%B9%83%E6%9C%A8%E5%9D%8246#%E3%83%A1%E3%83%B3%E3%83%90%E3%83%BC'
            url += nogizakaHome;
            break
        case 'sakurazaka':
            const sakurazakaHome = '/wiki/%E6%AB%BB%E5%9D%8246'
            url += sakurazakaHome
            break;
        case 'hinatazaka':
            const hinatazakaHome = '/wiki/%E6%97%A5%E5%90%91%E5%9D%8246'
            url += hinatazakaHome
            break;
        default:
            throw Error(`not impletemnetd type ${idle}`)
    }
    const homeResponse = await axios.get(url);
    if (homeResponse.status !== 200) {
        return Promise.reject(`status ${homeResponse.status}`)
    }

    const members = extractMembers(homeResponse.data)
    return members
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
}
import { Page } from 'puppeteer';

interface Name {
  kanji: string;
  hiragana: string;
}

export class NameDictionary {
  constructor(private names: Name[]) {}

  formatMicrosoftIMEDictionary(): string {
    return this.names.reduce((acc, curr) => {
      acc +=
        `${curr.kanji.replace(/\s/g, '')}\t` +
        `${curr.hiragana?.replace(/\s/g, '')}\t` +
        `名詞\n`;
      return acc;
    }, '');
  }

  formatGoogleDictionary(names: Name[]): string {
    return this.names.reduce((acc, curr) => {
      acc +=
        `${curr.hiragana?.replace(/\s/g, '')}\t` +
        `${curr.kanji.replace(/\s/g, '')}\t` +
        `名詞\n`;
      return acc;
    }, '');
  }
}

export const nogizakaMembers = async (page: Page): Promise<NameDictionary> => {
  const url = 'https://www.nogizaka46.com/member/';
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const units = await page.$$('.unit');

  const members: Name[] = await Promise.all(
    units.map(async (unit) => {
      const member = await page.evaluate((elm) => {
        const kanji = elm.querySelector('.main')?.textContent;
        const hiragana = elm.querySelector('.sub')?.textContent;
        return { kanji, hiragana };
      }, unit);
      return member;
    })
  );
  return new NameDictionary(members);
};

export const sakurazakaMembers = async (
  page: Page
): Promise<NameDictionary> => {
  const url =
    'https://sakurazaka46.com/s/s46/search/artist?ima=0000&link=ROBO004';
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const units = await page.$$('li.box');

  const members: Name[] = await Promise.all(
    units.map(async (unit) => {
      const member = await page.evaluate((elm) => {
        const kanji = elm.querySelector('.name')?.textContent;
        const hiragana = elm.querySelector('.kana')?.textContent;
        return { kanji, hiragana };
      }, unit);
      return member;
    })
  );
  return new NameDictionary(members);
};

export const hinatazakaMembers = async (
  page: Page
): Promise<NameDictionary> => {
  const url = 'https://www.hinatazaka46.com/s/official/search/artist?ima=0000';
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const units = await page.$$('.p-member__item');

  const members: Name[] = await Promise.all(
    units.map(async (unit) => {
      const member = await page.evaluate((elm) => {
        const kanji = elm.querySelector('.c-member__name')?.textContent;
        const hiragana = elm.querySelector('.c-member__kana')?.textContent;
        return { kanji, hiragana };
      }, unit);
      return member;
    })
  );
  return new NameDictionary(members.filter((n) => n.hiragana));
};

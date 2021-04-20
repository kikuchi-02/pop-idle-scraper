import { publishDates } from './scraper-utils/time';
import { Magazine } from './typing';
/*
楽天マガジン要チェック雑誌
芸能系
頻度多
・週刊プレイボーイ 月
・月刊エンタメ 毎月30日
・EX大衆 毎月15日
・Platinum FLASH 不定期
*/
const magazines1 = (date: Date): string[][] => {
  const magazines: string[][] = [];
  if (date.getDay() == 1) {
    magazines.push(['週刊プレイボーイ']);
  }
  if (date.getDate() == 30) {
    magazines.push([
      '月刊エンタメ',
      'https://magazine.rakuten.co.jp/title/02053/',
    ]);
  }
  if (date.getDate() === 15) {
    magazines.push(['EX大衆', 'https://magazine.rakuten.co.jp/title/A11E0/']);
  }
  return magazines;
};

/*
頻度中（時々グラビア掲載）
・FRIDAY 金
・サイゾー 毎月１８日
・ FLASH 火
・日経エンタメ 毎月４日
*/

const magazines2 = (date: Date): string[][] => {
  const magazines: string[][] = [];
  if (date.getDay() === 5) {
    magazines.push(['FRIDAY', 'https://magazine.rakuten.co.jp/title/22211/']);
  }
  if (date.getDate() === 18) {
    magazines.push(['サイゾー', 'https://magazine.rakuten.co.jp/title/04111/']);
  }
  if (date.getDay() === 2) {
    magazines.push(['FLASH', 'https://magazine.rakuten.co.jp/title/A0SP0/']);
  }
  if (date.getDate() === 4) {
    magazines.push([
      '日経エンタメ',
      'https://magazine.rakuten.co.jp/title/07183/',
    ]);
  }
  return magazines;
};
/*
頻度小（スキャンダルで掲載）
・SPA！ 火
・週刊大衆 月
・女性自身 火
・週刊文春 木
・週刊新潮 木
・女性セブン 紙版は木、電子版は金
・週刊ポスト 紙版は月、電子版は火
*/
const magazines3 = (date: Date): string[][] => {
  const magazines: string[][] = [];
  switch (date.getDay()) {
    case 1:
      magazines.push([
        '週刊大衆',
        'https://magazine.rakuten.co.jp/title/A0YR0/',
      ]);
      break;
    case 2:
      magazines.push(
        ['SPA！', 'https://magazine.rakuten.co.jp/title/23451/'],
        ['女性自身', 'https://magazine.rakuten.co.jp/title/A0SQ0/'],
        ['週刊ポスト', 'https://magazine.rakuten.co.jp/title/A0VT0/']
      );
      break;
    case 4:
      magazines.push(
        ['週刊文春', 'https://magazine.rakuten.co.jp/title/A10T0/'],
        ['週刊新潮', 'https://magazine.rakuten.co.jp/title/20311']
      );
      break;
    case 5:
      magazines.push([
        '女性セブン',
        'https://magazine.rakuten.co.jp/title/20924/',
      ]);
      break;
    default:
      break;
  }
  return magazines;
};

/*
 女性ファッション
・ar 毎月１２
・LARME 3,6,9,12月の17日
・non-no 毎月２０日
・ViVi 毎月２３日
・Ray 毎月23日
・CamCam 毎月23日
・Seventeen 毎月1日
・bis 偶数月1日
*/
const magazines4 = (date: Date): string[][] => {
  const magazines: string[][] = [];
  switch (date.getDate()) {
    case 1:
      magazines.push([
        'Seventeen',
        'https://magazine.rakuten.co.jp/title/05625/',
      ]);
      if ((date.getMonth() + 1) % 2 === 0) {
        magazines.push(['bis', 'https://magazine.rakuten.co.jp/title/17687/']);
      }
      break;
    case 12:
      magazines.push(['ar', 'https://magazine.rakuten.co.jp/title/11431/']);
      break;
    case 17:
      if ((date.getMonth() + 1) % 3 === 0) {
        magazines.push(['LARME', 'https://magazine.rakuten.co.jp/title/A1BP0']);
      }
      break;
    case 20:
      magazines.push(['non-no', 'https://magazine.rakuten.co.jp/title/07283/']);
      break;
    case 23:
      magazines.push(
        ['Ray', 'https://magazine.rakuten.co.jp/title/09695/'],
        ['CanCam', 'https://magazine.rakuten.co.jp/title/A0KR0/']
      );
      break;
    default:
      break;
  }
  return magazines;
};

export const todaysMagazines = async (): Promise<Magazine[][]> => {
  const dates = await publishDates();

  return [magazines1, magazines2, magazines3, magazines4].map((func) => {
    return dates.reduce((acc: Magazine[], curr: Date) => {
      const ms = func(curr).map((m) => {
        return { title: m[0], link: m[1] } as Magazine;
      });
      acc.push(...ms);
      return acc;
    }, []);
  });
};

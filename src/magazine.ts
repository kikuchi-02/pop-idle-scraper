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
    magazines.push(['月刊エンタメ']);
  }
  if (date.getDate() === 15) {
    magazines.push(['EX大衆']);
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
    magazines.push(['FRIDAY']);
  }
  if (date.getDate() === 18) {
    magazines.push(['サイゾー']);
  }
  if (date.getDay() === 2) {
    magazines.push(['FLASH']);
  }
  if (date.getDate() === 4) {
    magazines.push(['日経エンタメ']);
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
      magazines.push(['週刊大衆']);
      break;
    case 2:
      magazines.push(['SPA！'], ['女性自身'], ['週刊ポスト']);
      break;
    case 4:
      magazines.push(['週刊文春'], ['週刊新潮']);
      break;
    case 5:
      magazines.push(['女性セブン']);
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
      magazines.push(['Seventeen']);
      if ((date.getMonth() + 1) % 2 === 0) {
        magazines.push(['bis']);
      }
      break;
    case 12:
      magazines.push(['ar']);
      break;
    case 17:
      if ((date.getMonth() + 1) % 3 === 0) {
        magazines.push(['LARME']);
      }
      break;
    case 20:
      magazines.push(['non-no']);
      break;
    case 23:
      magazines.push(['Ray'], ['CamCam']);
      break;
    default:
      break;
  }
  return magazines;
};

export const todaysMagazines = () => {
  const date = new Date();

  return [
    magazines1(date),
    magazines2(date),
    magazines3(date),
    magazines4(date),
  ];
};

import * as cheerio from 'cheerio';

import axios from 'axios';
import { launch } from 'puppeteer';
import { setLanguage } from './utils';

const nogizaka = async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await setLanguage(page);

  const url = 'https://www.nogizaka46.com/schedule/';
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

  const accumulated = [];

  for (let i = 0; i < 9; i++) {
    const data = await page.$$eval('.last-child > ul > li > a', (anchors) => {
      return Array.from(anchors).map((anchor) => {
        const category = (anchor as any).className;
        const title = (anchor as any).textContent;
        return { category, title };
      });
    });
    const date = await page.$eval('#scheduleH2', (elm) => elm.textContent);
    accumulated.push({ date, data });
    await page.click(
      '#N0 > div.scheduleNav.clearfix > div.first-child > form > input[type=submit]:nth-child(4)'
    );
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
  }

  return accumulated;
};

const sakurazaka = async () => {
  const target = [...new Array(6)].map((_, i) => 202100 + i + 1);

  const result: any[] = [];
  for (let j = 0; j < target.length; j++) {
    const url = `https://sakurazaka46.com/s/s46/media/list?dy=${target[j]}`;
    console.log({ url });
    const response = await axios.get(url);
    const htmlString = response.data;

    const $ = cheerio.load(htmlString);
    // return;
    const main = $('main')
      .find('.js-schedule-detail')
      .toArray()
      .map((detail) => {
        const media = $(detail).find('.type').text().trim();
        const title = $(detail).find('.title').text().trim();
        const members = $(detail)
          .find('.members > li > a')
          .toArray()
          .map((anchor) => $(anchor).text().replace(/\s/g, ''));

        return { media, title, members };
      });
    result.push(...main);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(target[j], result.length);
  }

  return result;
};

const hinatazakaDetail = async (url: string) => {
  const response = await axios.get(url);
  const htmlString = response.data;
  const $ = cheerio.load(htmlString);

  const members = $('.c-article__tag')
    .find('a')
    .toArray()
    .map((anchor) => $(anchor).text().replace(/\s/g, ''));
  return { members };
};

const hinatazaka = async () => {
  const baseUrl = 'https://www.hinatazaka46.com';

  const target = [...new Array(6)].map((_, i) => 202100 + i + 1);

  const result: any[] = [];
  for (let j = 0; j < target.length; j++) {
    const url = `https://www.hinatazaka46.com/s/official/media/list?dy=${target[j]}`;
    console.log({ url });
    const response = await axios.get(url);
    const htmlString = response.data;

    const $ = cheerio.load(htmlString);
    // return;
    const main: any = $('.l-maincontents--schedule')
      .find('.p-schedule__item > a')
      .toArray()
      .map((anchor) => {
        const media = $(anchor).find('.category_media').text().trim();
        const link = anchor.attribs.href;
        const title = $(anchor).find('.c-schedule__text').text().trim();
        return { media, link, title };
      });

    for (let i = 0; i < main.length; i++) {
      if (i % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      const schedule = main[i];
      const post: {
        [key: string]: string | string[];
      } = await hinatazakaDetail(baseUrl + schedule.link).catch((e) => {
        console.log(e);
        return {};
      });
      post.media = schedule.media;
      post.title = schedule.title;
      result.push(post);
    }
    console.log(target[j], result.length);
  }

  return result;
};

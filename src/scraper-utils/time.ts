import axios from 'axios';
import { Cache } from '../cache';

const getHolydaies = async (): Promise<Date[]> => {
  const cacher = new Cache<string[]>('holydaies');
  let holydaies = cacher.getCache();
  if (holydaies) {
    return holydaies.map((d) => new Date(d));
  }

  const url = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
  const response = await axios.get(url);

  holydaies = response.data
    .split('\n')
    .filter((line: string) =>
      /^\d{4}\/(\d{1}|\d{2})\/(\d{1}|\d{2}),/.test(line)
    )
    .map((d: string) => d.split(',')[0]);

  cacher.saveCache(holydaies);

  return holydaies.map((d) => new Date(d));
};

const isDayOff = (date: Date, holidaies: Date[]) => {
  // weekend
  if ([0, 6].includes(date.getDay())) {
    return true;
  }
  // holiday
  if (
    holidaies.find(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear()
    )
  ) {
    return true;
  }
  return false;
};

export const publishDates = async (): Promise<Date[]> => {
  const holydaies = await getHolydaies();

  const today = new Date();
  if (isDayOff(today, holydaies)) {
    return [];
  }

  const accdate = [];
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 1);
  while (isDayOff(targetDate, holydaies) && accdate.length < 5) {
    // clone
    accdate.push(new Date(targetDate.getTime()));
    targetDate.setDate(targetDate.getDate() - 1);
  }
  return accdate;
};

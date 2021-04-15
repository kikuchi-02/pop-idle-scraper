import { Page } from "puppeteer";

export const formatDate = (_date: string | number): string => {
  const date = new Date(_date);
  const str =
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + date.getDate()).slice(-2) +
    " " +
    `(${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})`;
  return str;
};

export const setLanguage = async (page: Page) => {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "language", {
      get: function () {
        return "ja-JA";
      },
    });
    Object.defineProperty(navigator, "languages", {
      get: function () {
        return ["ja-JA", "ja"];
      },
    });
  });
};

export const urlify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
};

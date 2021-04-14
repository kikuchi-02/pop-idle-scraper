import { Page } from "puppeteer";

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

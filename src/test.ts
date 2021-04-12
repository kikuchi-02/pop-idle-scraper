import { readFileSync } from "fs";

(() => {
  const data = JSON.parse(readFileSync("scraped/nogizaka.json", "utf-8"));

  data.slice(0, 3).map((d: any) => {
    console.log(new Date(d.date).toUTCString());
    const now = Date.now();

    const diff = Math.floor((now - d.date) / (1000 * 60 * 60 * 24));
    console.log(diff);

    return {
      date: new Date(d.date).toUTCString(),
      title: d.title,
    };
  });
})();

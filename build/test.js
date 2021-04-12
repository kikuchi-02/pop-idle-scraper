"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
(function () {
    var data = JSON.parse(fs_1.readFileSync("scraped/nogizaka.json", "utf-8"));
    data.slice(0, 3).map(function (d) {
        console.log(new Date(d.date).toUTCString());
        var now = Date.now();
        var diff = Math.floor((now - d.date) / (1000 * 60 * 60 * 24));
        console.log(diff);
        return {
            date: new Date(d.date).toUTCString(),
            title: d.title,
        };
    });
})();

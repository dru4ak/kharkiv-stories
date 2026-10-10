import http from "node:http";

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let d = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(d));
      })
      .on("error", reject);
  });
}

const html = await get("http://localhost:3000/kh");
const i = html.indexOf("ракло");
console.log("snippet:", JSON.stringify(html.slice(Math.max(0, i - 120), i + 120)));
console.log("has Харьк", /Харьк/.test(html));
console.log("has switcher labels", html.includes("localeLabels") || html.includes("/uk") && html.includes("/en"));
console.log("href uk", html.includes('href="/uk"') || html.includes("href=\\\"/uk\\\""));
// find LanguageSwitcher links
const links = [...html.matchAll(/href="\/(kh|uk|en)(?:\/[^"]*)?"/g)].slice(0, 15);
console.log("locale hrefs", links.map((m) => m[0]));

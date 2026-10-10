import http from "node:http";

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let d = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, d }));
      })
      .on("error", reject);
  });
}

for (const url of [
  "http://localhost:3000/kh/map",
  "http://localhost:3000/kh/people",
  "http://localhost:3000/uk",
  "http://localhost:3000/en",
]) {
  const { status, d } = await get(url);
  console.log("\n", url, status);
  if (url.includes("map")) {
    console.log("  has 1942.kharkiv", d.includes("1942.kharkiv"));
    console.log("  has map-1942", d.includes("map-1942"));
    console.log("  has 1887 label", d.includes(">1887<") || d.includes('"1887"'));
    console.log("  has oldplan title", d.includes("Старинные планы"));
  }
  if (url.includes("people")) {
    console.log("  Bulgakov", d.includes("Булгаков"));
    console.log("  Goethe", d.includes("Гёте") || d.includes("Гете"));
    console.log("  Landau", d.includes("Ландау"));
    console.log("  Vyshnya", d.includes("Вишня"));
  }
  if (url.endsWith("/uk") || url.endsWith("/en")) {
    console.log("  EN switch", d.includes(">EN<") || d.includes("EN</"));
    console.log("  Укр switch", d.includes("Укр."));
    console.log("  Харьк switch", d.includes("Харьк."));
  }
}

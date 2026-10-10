import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const meta = JSON.parse(
  fs.readFileSync(path.join(dir, "missing-meta.json"), "utf8"),
);
const half = Math.ceil(meta.length / 2);
const tailRaw = fs.readFileSync(path.join(dir, "../_batch0-tail.mjs"), "utf8");
const tailObj = Function(`return ({${tailRaw}})`)();
const have = new Set(Object.keys(tailObj));
have.add("ulovka-artista");
have.add("lechenie-rozgami");
have.add("darom");
const miss = meta.slice(0, half).filter((x) => !have.has(x.slug));
fs.writeFileSync(
  path.join(dir, "_missing-a-need.json"),
  JSON.stringify(miss, null, 2),
);
console.log(miss.length);

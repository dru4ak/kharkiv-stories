import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const batchPath = path.join(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  "scripts/i18n-batches/batch-1.json",
);
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));

function fixUk(s) {
  return s
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov")
    .replace(/Сineщекov/g, "Сінещекov");
}

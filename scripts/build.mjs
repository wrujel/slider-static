// Assembles the deployable site into dist/.
//
// The repo root doubles as the source tree, so publishing it directly would
// also serve package.json, vitest.config.js, the test suite and the lockfile
// from the live site. This copies only what index.html actually loads.
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const OUT = "dist";
const ASSETS = ["index.html", "styles.css", "app.js", "images", "fonts"];

// Studio-owned README artwork that lives beside the slide images but is never
// loaded by the page — 1.8 MB of the deploy for nothing.
const EXCLUDE = new Set(["images/screenshot.png"]);

const relative = (from) =>
  path.relative(process.cwd(), path.resolve(from)).split(path.sep).join("/");

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const asset of ASSETS) {
  await cp(asset, path.join(OUT, asset), {
    recursive: true,
    filter: (src) => !EXCLUDE.has(relative(src)),
  });
}

console.log(`Built ${OUT}/ from: ${ASSETS.join(", ")}`);

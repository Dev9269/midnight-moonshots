// Syntax-check every JS entry point. Zero-dependency CI signal.

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const dirs = ["src", "src/ui", "scripts"];
const files = [];

for (const dir of dirs) {
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".js") || f.endsWith(".mjs")) {
      files.push(join(dir, f));
    }
  }
}

let failed = false;
for (const f of files) {
  const r = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
  if (r.status !== 0) {
    failed = true;
    console.error(`SYNTAX ERROR in ${f}\n${r.stderr}`);
  } else {
    console.log(`ok  ${f}`);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`\n${files.length} files check clean.`);
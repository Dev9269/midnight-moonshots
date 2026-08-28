// Static build: copies src/ui -> dist. Dependency-free so `npm run build`
// works anywhere (this is served statically; the DevNet wiring is documented).

import { mkdirSync, cpSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src", "ui");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const f of ["index.html", "style.css", "app.js", "app-core.js"]) {
  cpSync(join(src, f), join(out, f));
}
cpSync(join(root, "src", "ledger.js"), join(out, "ledger.js"));

console.log(`Built dist/ from ${src}`);
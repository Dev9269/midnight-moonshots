// Zero-dependency static dev server for the UI.
//
//   npm run dev            # serve src/ui on :4173
//   npm run dev -- 8080    # or a custom port
//
// Production usage: `npm run build` then serve dist/ with any static host.

import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "src", "ui");
const alias = { "/ledger.js": join(root, "src", "ledger.js") };
const port = Number(process.argv[2] || process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

const server = createServer((req, res) => {
  let rel;
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    rel = normalize(urlPath).replace(/^([/\\])+/, "");
  } catch {
    rel = "";
  }

  let file;
  if (alias["/" + rel]) {
    file = alias["/" + rel];
  } else {
    file = join(publicDir, rel || "index.html");
  }

  try {
    const body = readFileSync(file);
    const ext = file.slice(file.lastIndexOf("."));
    res.writeHead(200, { "content-type": types[ext] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  }
});

server.listen(port, () => console.log(`PrivatePay UI on http://localhost:${port}`));
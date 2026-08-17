/**
 * A static file server that honours HTTP Range requests, for testing the
 * exported site the way a real host serves it.
 *
 * Python's http.server does not do Range, which makes video unseekable — the
 * scroll-scrubbed intro freezes on frame one. Real hosts (GitHub Pages, S3,
 * nginx) all answer 206, so test against this, not against http.server.
 *
 *   node scripts/serve-static.mjs [port] [dir]
 */
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const port = Number(process.argv[2] || 4321);
const root = process.argv[3] || "out";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".mp4": "video/mp4", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain",
};

const resolve = (urlPath) => {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const p = join(root, clean);
  if (existsSync(p) && statSync(p).isDirectory()) {
    const idx = join(p, "index.html");
    return existsSync(idx) ? idx : null;
  }
  if (existsSync(p)) return p;
  // mirrors a host that serves /tr as /tr/index.html
  const asDir = join(p, "index.html");
  return existsSync(asDir) ? asDir : null;
};

createServer((req, res) => {
  const file = resolve(req.url);
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("404");
  }
  const { size } = statSync(file);
  const type = TYPES[extname(file)] || "application/octet-stream";
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Number(m[2]) : size - 1;
    res.writeHead(206, {
      "content-type": type,
      "content-range": `bytes ${start}-${end}/${size}`,
      "accept-ranges": "bytes",
      "content-length": end - start + 1,
    });
    return createReadStream(file, { start, end }).pipe(res);
  }

  res.writeHead(200, { "content-type": type, "content-length": size, "accept-ranges": "bytes" });
  createReadStream(file).pipe(res);
}).listen(port, "0.0.0.0", () =>
  console.log(`static (with Range) → http://localhost:${port}  serving ${root}/`),
);

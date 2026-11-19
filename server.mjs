// Production server for the built site: `npm start`.
// Serves the static files in ./dist and listens on the port the host gives us in PORT.
// If ./dist has not been built (hosts that only run `npm start`, such as GoDaddy), it builds the site
// first with Vite, showing a short "being prepared" page meanwhile. No dependencies beyond Node itself.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "dist");
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0"; // listen on all interfaces so the platform can reach it

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

const isFile = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

/* ── Build on start when dist is missing ── */
let state = existsSync(join(root, "index.html")) ? "ready" : "building";

const building = (res) => {
  const failed = state === "failed";
  res.writeHead(503, { "Content-Type": "text/html; charset=utf-8", "Retry-After": "15", "Cache-Control": "no-store" });
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${failed ? "" : '<meta http-equiv="refresh" content="10">'}<title>PenCom</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#F6F8F3;color:#0E2414}
main{max-width:28rem;padding:2rem;text-align:center}h1{font-size:1.4rem}p{color:#4b5563;line-height:1.5}
.dot{width:12px;height:12px;border-radius:50%;background:#117F21;display:inline-block;animation:p 1.2s infinite}@keyframes p{50%{opacity:.25}}</style></head>
<body><main>${failed ? "" : '<span class="dot" aria-hidden="true"></span>'}<h1>${failed ? "The site could not be built" : "The PenCom site is being prepared"}</h1>
<p>${failed ? "Please check the server log for the build error." : "This takes about a minute after an update. The page will refresh by itself."}</p></main></body></html>`);
};

if (state === "building") {
  const vite = join(here, "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(vite)) {
    state = "failed";
    console.error("dist/ is missing and Vite is not installed, so the site cannot be built. Run `npm install` (or `npm run build`) before `npm start`.");
  } else {
    console.log("dist/ not found: building the site with Vite…");
    const child = spawn(process.execPath, [vite, "build"], { cwd: here, stdio: "inherit", env: { ...process.env, NODE_ENV: "production" } });
    child.on("exit", (code) => {
      state = code === 0 && existsSync(join(root, "index.html")) ? "ready" : "failed";
      console.log(state === "ready" ? "Build finished; serving the site." : `Build failed (exit code ${code}).`);
    });
  }
}

const server = createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "text/plain" }).end(state === "ready" ? "ok" : state);
      return;
    }
    if (state !== "ready") {
      building(res);
      return;
    }
    const clean = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
    let file = join(root, clean);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if (!(await isFile(file))) {
      const dirIndex = join(file, "index.html");
      if (await isFile(dirIndex)) file = dirIndex;
      else if (extname(clean)) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      } else file = join(root, "index.html"); // the app's own routes
    }
    const body = await readFile(file);
    const hashed = file.includes(`${sep}assets${sep}`);
    res.writeHead(200, {
      "Content-Type": types[extname(file).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": hashed ? "public, max-age=31536000, immutable" : "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Server error");
  }
});

server.listen(port, host, () => {
  console.log(`PenCom site listening on http://${host}:${port}`);
});

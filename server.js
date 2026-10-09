"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  let requestedPath;
  try {
    requestedPath = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  } catch (error) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.on("error", (error) => {
  console.error("Preview server could not start:", error.message);
  if (error.code === "EADDRINUSE") {
    console.error("Port 8000 is already in use. Stop the other preview server or set PORT=8001.");
  }
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log("Emberfield preview: http://127.0.0.1:" + port);
  console.log("Keep this window open while you use the preview. Press Ctrl+C to stop.");
});

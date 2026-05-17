const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
};

const server = http.createServer((req, res) => {
  let filePath =
    req.url === "/"
      ? "index.html"
      : req.url === "/controller"
        ? "controller.html"
        : req.url.slice(1);

  filePath = filePath.split("?")[0]; // strip query strings

  const abs = path.join(__dirname, filePath);
  const ext = path.extname(abs).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  fs.stat(abs, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end("Not found: " + filePath);
      return;
    }

    const fileSize = stat.size;
    const rangeHeader = req.headers["range"];

    if (rangeHeader) {
      // Range request — needed for video seeking
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (!match) {
        res.writeHead(416, { "Content-Range": `bytes */${fileSize}` });
        res.end();
        return;
      }
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });
      fs.createReadStream(abs, { start, end }).pipe(res);
    } else {
      // Full file
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(abs).pipe(res);
    }
  });
});

const wss = new WebSocket.Server({ server });
const players = new Set();
const controllers = new Set();

wss.on("connection", (ws, req) => {
  const role = req.url === "/player" ? "player" : "controller";
  if (role === "player") players.add(ws);
  else controllers.add(ws);
  console.log(`[+] ${role} connected`);

  ws.on("message", (msg) => {
    if (role === "controller") {
      players.forEach((p) => {
        if (p.readyState === WebSocket.OPEN) p.send(msg.toString());
      });
    }
  });

  ws.on("close", () => {
    players.delete(ws);
    controllers.delete(ws);
    console.log(`[-] ${role} disconnected`);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const { networkInterfaces } = require("os");
  let localIP = "localhost";
  for (const iface of Object.values(networkInterfaces()).flat()) {
    if (iface.family === "IPv4" && !iface.internal) {
      localIP = iface.address;
      break;
    }
  }
  console.log(`\n✅ Server running!`);
  console.log(`   Mac    → http://localhost:${PORT}`);
  console.log(`   iPhone → http://${localIP}:${PORT}/controller\n`);
});

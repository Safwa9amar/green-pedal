// server.js
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 9002;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // ✅ Create socket server
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // adjust for security
    },
  });

  // ✅ Attach to global so all files can use it
  global._io = io;

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Ready on http://${hostname}:${port}`);
    });
});

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
    try {
      const { token } = socket.handshake.auth;

      // Check if token exists
      if (!token) {
        console.log("⛔ No token provided, disconnecting client...");
        socket.disconnect(true);
        return;
      }

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        console.log("⛔ Invalid token, disconnecting client...");
        socket.disconnect(true);
        return;
      }

      console.log(
        `🔌 Client connected: ${socket.id}, User ID: ${decoded.userId}`
      );

      // You can store user info for later use
      socket.data.user = decoded;

      // Example: emit a welcome message
      socket.emit("connected", { message: "You are connected to the server!" });

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
      });
    } catch (err) {
      console.error("⚠️ Socket connection error:", err);
      socket.disconnect(true);
    }
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
import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return null;
  }
}

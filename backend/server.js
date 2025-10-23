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

      socket.on("join", ({ room }) => {
        socket.join(room);
        console.log(`✅ Socket ${socket.id} joined room ${room}`);
        // optional confirmation back to client
        socket.emit("joined", { room });
      });

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
      console.log(`
        ▲ Next.js 15.3.3 (with socket io)
        - Local:      http://${hostname}:${port}
        - Network:      http://192.168.1.9:9002
        - Environments: .env  
      `);
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
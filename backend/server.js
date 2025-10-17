import express from "express";
import http from "http";
import next from "next";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 9002;

const nextApp = next({ dev, hostname, port });
const handler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);

  // ✅ Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ adjust for production security
    },
  });

  // Make Socket.IO globally available if needed
  global._io = io;

  // ✅ Socket.IO logic
  io.on("connection", (socket) => {
    try {
      const { token } = socket.handshake.auth;

      if (!token) {
        console.log("⛔ No token provided, disconnecting client...");
        socket.disconnect(true);
        return;
      }

      const decoded = verifyToken(token);
      if (!decoded || !decoded.userId) {
        console.log("⛔ Invalid token, disconnecting client...");
        socket.disconnect(true);
        return;
      }

      console.log(`🔌 Client connected: ${socket.id}, User ID: ${decoded.userId}`);
      socket.data.user = decoded;

      socket.emit("connected", { message: "You are connected to the server!" });

      socket.on("join", ({ room }) => {
        socket.join(room);
        console.log(`✅ Socket ${socket.id} joined room ${room}`);
        socket.emit("joined", { room });
      });

      socket.on("disconnect", (reason) => {
        console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
      });
    } catch (err) {
      console.error("⚠️ Socket connection error:", err);
      socket.disconnect(true);
    }
  });

  // ✅ Example Express API route
  app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express + Next.js + Socket.IO 🚀" });
  });

  // ✅ Let Next.js handle all other routes
  app.all("*", (req, res) => handler(req, res));

  // ✅ Start the server
  server.listen(port, () => {
    console.log(`
      ▲ Next.js + Express + Socket.IO Server
      - Local:      http://${hostname}:${port}
      - Network:    http://192.168.1.9:${port}
      - Env:        ${dev ? "Development" : "Production"}
    `);
  });
});

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
}

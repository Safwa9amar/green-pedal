import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Extend the Node global type to include our socket instance
declare global {
  // eslint-disable-next-line no-var
  var _io: SocketIOServer | undefined;
}

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO (singleton)
 * @param server - The HTTP server instance
 * @returns {SocketIOServer} io instance
 */
export function initIO(server: HTTPServer): SocketIOServer {
  if (io) {
    console.warn(
      "⚠️ Socket.io already initialized — returning existing instance."
    );
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // You can restrict this for security
      methods: ["GET", "POST"],
    },
  });

  global._io = io;
  console.log("✅ Socket.io initialized successfully.");
  return io;
}

/**
 * Get existing Socket.IO instance safely
 * @returns {SocketIOServer} io instance
 */
export function getIO(): SocketIOServer {
  if (!io && global._io) {
    io = global._io; // recover from global
  }

  if (!io) {
    throw new Error("❌ Socket.io not initialized! Call initIO(server) first.");
  }

  return io;
}

/**
 * Gracefully close the Socket.IO instance
 */
export function closeIO(): void {
  if (io) {
    io.close(() => console.log("🧹 Socket.io closed."));
    io = null;
    global._io = undefined;
  }
}

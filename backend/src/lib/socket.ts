// lib/socket.js
let io;

export function getIO() {
  if (!global._io) {
    throw new Error("❌ Socket.io not initialized! Run through server.js");
  }
  return global._io;
}

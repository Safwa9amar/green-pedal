import { useEffect } from "react";
import { socket } from "@/src/services/socket";

export default function useSocket() {
  useEffect(() => {
    console.log("⚡ Connecting to socket server...");
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("❌ Socket disconnected:", reason);
    });

    return () => {
      console.log("🧹 Cleaning up socket...");
      socket.disconnect();
    };
  }, []);

  return socket;
}

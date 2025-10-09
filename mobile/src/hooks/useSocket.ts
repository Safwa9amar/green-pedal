import { useEffect } from "react";
import { socket } from "@/src/services/socket";
import { useAuthStore } from "@/src/store";

export default function useSocket() {
  const { token, user } = useAuthStore();
  useEffect(() => {
    console.log("⚡ Connecting to socket server...");
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
    socket.emit("join", { room: `user:${user?.id}` });
    socket.on("joined", (room: any) => {
      console.log("user joined to room ", room);
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

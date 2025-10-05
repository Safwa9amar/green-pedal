import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // ⚠️ Replace with your server IP on the LAN (not localhost if on device)
    const newSocket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
      path: "/api/socket/io",
      transports: ["websocket"], // RN works better with websocket transport
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
    });

    newSocket.on("message", (msg: string) => {
      console.log("📩 New message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (msg: string) => {
    socket?.emit("message", msg);
  };

  return { socket, messages, sendMessage };
}

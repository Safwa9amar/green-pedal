import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(process.env.EXPO_PUBLIC_API_URL!, {
      path: "/socket",
      transports: ["websocket"], // RN requires websocket
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

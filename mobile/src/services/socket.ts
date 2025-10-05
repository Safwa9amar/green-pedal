"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
  transports: ["websocket"], // RN requires websocket
});

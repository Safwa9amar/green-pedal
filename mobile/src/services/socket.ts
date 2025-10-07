"use client";

import { io } from "socket.io-client";
import { useAuthStore } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
  transports: ["websocket"], // RN requires websocket
  // auth: { token: token },
  autoConnect: false,
});

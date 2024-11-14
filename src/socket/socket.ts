import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {

  socket = io("http://localhost:5678", {
    auth: { token }, 
  });

  socket.on("connect", () => {
    console.log("Connected WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected WebSocket server");
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

import { io } from "socket.io-client";
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("pollUpdated", (data) => {
  console.log("Poll updated:", JSON.stringify(data, null, 2));
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

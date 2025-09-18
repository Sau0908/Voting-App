import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
import { userRouter } from "./api/routes/user";
import { pollRouter } from "./api/routes/poll";
import { voteRouter } from "./api/routes/vote";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/health", async (req, res) => {
  try {
    const dbResponse = await prisma.$queryRaw`SELECT version()`;
    console.log("Database response:", dbResponse);
    res.json({ status: "OK", db: dbResponse });
  } catch (error) {
    res.status(500).json({ status: "ERROR", error });
  }
});

app.use("/user", userRouter);
app.use("/poll", pollRouter);
app.use("/vote", voteRouter);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("join_poll", (pollId: string) => {
    socket.join(pollId);
    console.log(`Client ${socket.id} joined poll ${pollId}`);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server + WebSocket ready at: http://localhost:${port}`);
});

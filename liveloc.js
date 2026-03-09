const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT_LOC;

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => res.json({ message: "Realtime server up 😸" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const live = io.of("/live");

const ts = () => new Date().toISOString().replace("T", " ").substring(0, 19);

live.on("connection", (socket) => {
  console.log(`[${ts()}] Client connected: ${socket.id}`);

  socket.on("join-room", ({ role_id, user_id }) => {
    if (!role_id || !user_id) return;

    socket.data.role_id = role_id;
    socket.data.user_id = user_id;

    console.log(`[${ts()}] Socket ${socket.id} joined as role ${role_id}, user ${user_id}`);
  });

  socket.on("watch-user", ({ user_id }) => {
    if (!user_id) return;
    const userRoom = `user_${user_id}`;
    socket.join(userRoom);
    console.log(`[${ts()}] Socket ${socket.id} (role ${socket.data.role_id}) watching user ${user_id}`);
  });

  socket.on("unwatch-user", ({ user_id }) => {
    if (!user_id) return;
    const userRoom = `user_${user_id}`;
    socket.leave(userRoom);
    console.log(`[${ts()}] Socket ${socket.id} stopped watching user ${user_id}`);
  });

  socket.on("send-location", (data) => {
    const { role_id, user_id } = data;
    if (role_id !== 4 || !user_id) return;

    const userRoom = `user_${user_id}`;
    console.log(`[${ts()}] Send location from user ${user_id} to room ${userRoom}`);

    live.to(userRoom).emit("receive-location", data);
  });

  socket.on("disconnect", () => {
    console.log(`[${ts()}] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[${ts()}] Realtime server running on port ${PORT}`);
});

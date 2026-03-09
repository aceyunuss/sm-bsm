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

  socket.on("join-room", (payload) => {
    const { role_id, tenant_id, sub_tenant_id } = payload;
    if (!role_id || !tenant_id || !sub_tenant_id) return;

    const room = `tenant_${tenant_id}_sub_${sub_tenant_id}`;

    socket.join(room);
    socket.data.role_id = role_id;
    socket.data.room = room;
    socket.data.tenant_id = tenant_id;
    socket.data.sub_tenant_id = sub_tenant_id;

    console.log(`[${ts()}] Socket ${socket.id} joined room ${room} as role ${role_id}`);
  });

  socket.on("watch-user", ({ user_id, tenant_id, sub_tenant_id }) => {
    if (!user_id || !tenant_id || !sub_tenant_id) return;
    const userRoom = `tenant_${tenant_id}_sub_${sub_tenant_id}:user_${user_id}`;
    socket.join(userRoom);
    console.log(`[${ts()}] Socket ${socket.id} (role ${socket.data.role_id}) watching user ${user_id}`);
  });

  socket.on("unwatch-user", ({ user_id, tenant_id, sub_tenant_id }) => {
    if (!user_id || !tenant_id || !sub_tenant_id) return;
    const userRoom = `tenant_${tenant_id}_sub_${sub_tenant_id}:user_${user_id}`;
    socket.leave(userRoom);
    console.log(`[${ts()}] Socket ${socket.id} stopped watching user ${user_id}`);
  });

  socket.on("send-location", (data) => {
    const { role_id, tenant_id, sub_tenant_id, user_id } = data;
    if (role_id !== 4 || !tenant_id || !sub_tenant_id || !user_id) return;

    const generalRoom = `tenant_${tenant_id}_sub_${sub_tenant_id}`;
    const userRoom = `tenant_${tenant_id}_sub_${sub_tenant_id}:user_${user_id}`;

    console.log(`[${ts()}] Send location from user ${user_id} to rooms: ${generalRoom}, ${userRoom}`);

    const roomSockets = live.adapter.rooms.get(generalRoom);
    const userRoomSockets = live.adapter.rooms.get(userRoom);
    const emittedTo = new Set();

    const isViewer = (s) => s && s.id !== socket.id && [1, 2, 3].includes(s.data.role_id);

    if (roomSockets) {
      roomSockets.forEach((socketId) => {
        const s = live.sockets.get(socketId);
        if (isViewer(s)) {
          console.log(`[${ts()}] Emitting location to socket ${s.id} in room ${generalRoom}`);
          s.emit("receive-location", data);
          emittedTo.add(socketId);
        }
      });
    }

    if (userRoomSockets) {
      userRoomSockets.forEach((socketId) => {
        if (emittedTo.has(socketId)) return;
        const s = live.sockets.get(socketId);
        if (isViewer(s)) {
          console.log(`[${ts()}] Emitting location to socket ${s.id} in user room ${userRoom}`);
          s.emit("receive-location", data);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`[${ts()}] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`[${ts()}] Realtime server running on port ${PORT}`);
});

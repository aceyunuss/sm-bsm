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

live.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (payload) => {
    const { role_id, tenant_id, sub_tenant_id } = payload;
    if (!role_id || !tenant_id) return;

    const room = `tenant_${tenant_id}${sub_tenant_id ? `_sub_${sub_tenant_id}` : ""}`;

    socket.join(room);
    socket.data.role_id = role_id;
    socket.data.room = room;
    socket.data.tenant_id = tenant_id;

    console.log(`Socket ${socket.id} joined room ${room} as role ${role_id}`);
  });

  socket.on("watch-user", ({ user_id, tenant_id }) => {
    if (!user_id || !tenant_id) return;
    const userRoom = `tenant_${tenant_id}:user_${user_id}`;
    socket.join(userRoom);
    console.log(`Socket ${socket.id} (role ${socket.data.role_id}) watching user ${user_id}`);
  });

  socket.on("unwatch-user", ({ user_id, tenant_id }) => {
    if (!user_id || !tenant_id) return;
    const userRoom = `tenant_${tenant_id}:user_${user_id}`;
    socket.leave(userRoom);
    console.log(`Socket ${socket.id} stopped watching user ${user_id}`);
  });

  socket.on("send-location", (data) => {
    const { role_id, tenant_id, sub_tenant_id, user_id } = data;
    if (role_id !== 3) return;

    const generalRoom = `tenant_${tenant_id}${sub_tenant_id ? `_sub_${sub_tenant_id}` : ""}`;
    const userRoom = `tenant_${tenant_id}:user_${user_id}`;

    const roomSockets = live.adapter.rooms.get(generalRoom);
    if (!roomSockets) return;

    roomSockets.forEach((socketId) => {
      const s = live.sockets.get(socketId);
      if (s && s.id !== socket.id && (s.data.role_id === 1 || s.data.role_id === 2 || s.data.role_id === 3)) {
        s.emit("receive-location", data);
      }
    });

    const userRoomSockets = live.adapter.rooms.get(userRoom);
    if (userRoomSockets) {
      userRoomSockets.forEach((socketId) => {
        const s = live.sockets.get(socketId);
        if (s && s.id !== socket.id && (s.data.role_id === 1 || s.data.role_id === 2 || s.data.role_id === 3) && !roomSockets.has(socketId)) {
          s.emit("receive-location", data);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});

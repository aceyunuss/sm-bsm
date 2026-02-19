// sender.js — Staff (role_id: 3) sends location every 2 seconds
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5001";
const TENANT_ID = "daritemnatn";
const SUB_TENANT_ID = "kesuban";
const USER_ID = 444; // ← ID staff ini

const socket = io(`${SERVER_URL}/live`);

socket.on("connect", () => {
  console.log("✅ Connected as SENDER (Staff):", socket.id);

  socket.emit("join-room", {
    role_id: 3,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
  });

  console.log("📡 Sending location every 2 seconds...\n");

  let lat = -99.2;
  let lng = 88.8;

  setInterval(() => {
    lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;

    const payload = {
      user_id: USER_ID, // ← tambah ini
      role_id: 3,
      tenant_id: TENANT_ID,
      sub_tenant_id: SUB_TENANT_ID,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-location", payload);
    console.log("📤 Sent:", payload);
  }, 3000);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

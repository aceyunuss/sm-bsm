// sender.js — Staff (role_id: 3) sends location every 2 seconds
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5001"; // change to your server URL
const TENANT_ID = "tenant123";
const SUB_TENANT_ID = "subA"; // set to null if not used

const socket = io(`${SERVER_URL}/live`);

socket.on("connect", () => {
  console.log("✅ Connected as SENDER (Staff):", socket.id);

  // Join room as staff (role_id = 3)
  socket.emit("join-room", {
    role_id: 3,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
  });

  console.log("📡 Sending location every 2 seconds...\n");

  // Simulate moving location
  let lat = -6.2;
  let lng = 106.8;

  setInterval(() => {
    lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;

    const payload = {
      user_id: 123,
      role_id: 3,
      tenant_id: TENANT_ID,
      sub_tenant_id: SUB_TENANT_ID,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      timestamp: new Date().toISOString(),
    };

    socket.emit("send-location", payload);
    console.log("📤 Sent:", payload);
  }, 2000);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

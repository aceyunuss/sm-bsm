// receiver.js — GM (role_id: 1) or Manager (role_id: 2) receives staff location
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5001"; // change to your server URL
const TENANT_ID = "tenant123";
const SUB_TENANT_ID = "subA"; // must match sender — set to null if not used

// Change to 2 to simulate Manager instead of GM
const MY_ROLE_ID = 1;
const ROLE_LABEL = MY_ROLE_ID === 1 ? "GM" : "Manager";

const socket = io(`${SERVER_URL}/live`);

socket.on("connect", () => {
  console.log(`✅ Connected as RECEIVER (${ROLE_LABEL}):`, socket.id);

  // Join room as GM or Manager
  socket.emit("join-room", {
    role_id: MY_ROLE_ID,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
  });

  console.log(`👂 Waiting for staff location updates...\n`);
});

socket.on("receive-location", (data) => {
  console.log("📍 Received location from Staff:");
  console.log(`   Lat: ${data.latitude}, Lng: ${data.longitude}`);
  console.log(`   Time: ${data.timestamp}`);
  console.log(`   Tenant: ${data.tenant_id}, Sub: ${data.sub_tenant_id}\n`);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});

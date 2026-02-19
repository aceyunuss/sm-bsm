// receiver.js — GM (role_id: 1) or Manager (role_id: 2) receives staff location
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5001";
const TENANT_ID = "tenant123";
const SUB_TENANT_ID = "subA";

const MY_ROLE_ID = 1;
const ROLE_LABEL = MY_ROLE_ID === 1 ? "GM" : "Manager";

// Set ke user_id tertentu untuk watch spesifik, atau null untuk terima semua
const WATCH_USER_ID = null;

const socket = io(`${SERVER_URL}/live`);

socket.on("connect", () => {
  console.log(`✅ Connected as RECEIVER (${ROLE_LABEL}):`, socket.id);

  socket.emit("join-room", {
    role_id: MY_ROLE_ID,
    tenant_id: TENANT_ID,
    sub_tenant_id: SUB_TENANT_ID,
  });

  // Kalau mau watch user spesifik
  if (WATCH_USER_ID) {
    socket.emit("watch-user", {
      user_id: WATCH_USER_ID,
      tenant_id: TENANT_ID,
    });
    console.log(`🎯 Watching specific user: ${WATCH_USER_ID}\n`);
  } else {
    console.log(`👂 Waiting for all staff location updates...\n`);
  }
});

socket.on("receive-location", (data) => {
  console.log(`📍 Received location from Staff (user_id: ${data.user_id}):`);
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

// ================================
// WEBSOCKET CONFIG
// ================================
const WS_URL = "wss://iot-ws-server.onrender.com"; // <-- YOUR Render URL
const socket = new WebSocket(WS_URL);

// ================================
// SOCKET EVENTS
// ================================
socket.onopen = () => {
  console.log("✅ WebSocket Connected");
};

socket.onerror = (err) => {
  console.error("❌ WebSocket Error", err);
};

socket.onclose = () => {
  console.warn("⚠️ WebSocket Disconnected");
};

// ================================
// RECEIVE DATA FROM SERVER / ESP32
// ================================
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const { id, state } = data;

  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (!card) return;

  const toggle = card.querySelector(".toggle");

  // ✅ SYNC CARD + TOGGLE (FIXED)
  if (state) {
    card.classList.add("on");
    toggle.classList.add("on");
  } else {
    card.classList.remove("on");
    toggle.classList.remove("on");
  }
};

// ================================
// HANDLE TOGGLE CLICK
// ================================
document.querySelectorAll(".toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".card");
    const id = card.dataset.id;

    const newState = !card.classList.contains("on");

    // ✅ INSTANT UI UPDATE (NO DELAY)
    if (newState) {
      card.classList.add("on");
      toggle.classList.add("on");
    } else {
      card.classList.remove("on");
      toggle.classList.remove("on");
    }

    // ✅ SEND STATE TO SERVER
    socket.send(JSON.stringify({
      id: id,
      state: newState
    }));
  });
});

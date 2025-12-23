const WS_URL = "wss://iot-ws-server.onrender.com";
const socket = new WebSocket(WS_URL);

// ================= SOCKET STATUS =================
socket.onopen = () => {
  console.log("✅ WebSocket Connected");
};

socket.onclose = () => {
  console.warn("⚠️ WebSocket Disconnected");
};

// ================= HANDLE INCOMING DATA =================
socket.onmessage = (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch {
    return;
  }

  const { id, state } = data;

  const card = document.querySelector(`.card[data-id="${id}"]`);
  if (!card) return;

  const toggle = card.querySelector(".toggle");

  // 🔒 ONLY update UI if state is DIFFERENT
  if (card.classList.contains("on") !== state) {
    card.classList.toggle("on", state);
    toggle.classList.toggle("on", state);
  }
};

// ================= HANDLE USER CLICK =================
document.querySelectorAll(".toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".card");
    const id = Number(card.dataset.id);

    const newState = !card.classList.contains("on");

    // ✅ IMMEDIATE UI UPDATE (NO WAIT)
    card.classList.toggle("on", newState);
    toggle.classList.toggle("on", newState);

    // ✅ SEND TO BACKEND
    socket.send(JSON.stringify({
      id,
      state: newState
    }));
  });
});

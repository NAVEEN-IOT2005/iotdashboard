const WS_URL = "wss://iot-ws-server.onrender.com";
const socket = new WebSocket(WS_URL);

socket.onopen = () => console.log("✅ WebSocket Connected");

socket.onmessage = (event) => {
  let data;
  try { data = JSON.parse(event.data); }
  catch { return; }

  const card = document.querySelector(`.card[data-id="${data.id}"]`);
  if (!card) return;

  const toggle = card.querySelector(".toggle");

  card.classList.toggle("on", data.state);
  toggle.classList.toggle("on", data.state);
};

document.querySelectorAll(".toggle").forEach(toggle=>{
  toggle.addEventListener("click",()=>{
    const card = toggle.closest(".card");
    const id = Number(card.dataset.id);
    const newState = !card.classList.contains("on");

    // Instant UI feedback
    card.classList.toggle("on", newState);
    toggle.classList.toggle("on", newState);

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        id:id,
        state:newState
      }));
    }
  });
});

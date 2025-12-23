const WS_URL = "https://iot-ws-server.onrender.com";
const socket = new WebSocket(WS_URL);

socket.onopen = () => {
  console.log("WebSocket Connected");
};

socket.onmessage = e => {
  const data = JSON.parse(e.data);

  const card = document.querySelector(
    `.card[data-id="${data.id}"]`
  );
  if (!card) return;

  card.classList.toggle("on", data.state);
};

document.querySelectorAll(".toggle").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".card");
    const id = card.dataset.id;
    const state = !card.classList.contains("on");

    socket.send(JSON.stringify({
      id,
      state
    }));
  });
});

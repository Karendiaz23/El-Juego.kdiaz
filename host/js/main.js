import socket from "./socketClient.js";
import { render } from "./renderer.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let players = {};

// DEBUG: confirmar que corre JS
console.log("MAIN CORRIENDO");

// estado inicial (para probar aunque no conecte server)
players["test"] = { x: 100, y: 100 };

// socket
socket.on("state", (data) => {
  console.log("STATE:", data);
  players = data;
});

function loop() {
  render(ctx, players);
  requestAnimationFrame(loop);
}

loop();
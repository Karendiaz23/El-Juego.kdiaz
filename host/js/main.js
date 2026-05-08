import socket from "./socketClient.js";
import { render } from "./renderer.js";

const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

let state = {};

window.addEventListener("keydown", (e) => {
  // NO avanzar si el juego terminó
  if (state.gameFinished) {
    return;
  }

  // PASAR DE NIVEL
  if (e.key === "Enter" && state.win) {
    socket.emit("nextLevel");
  }
});

socket.on("gameState", (serverState) => {
  state = serverState;
});

function gameLoop() {
  render(ctx, state);

  requestAnimationFrame(gameLoop);
}

gameLoop();
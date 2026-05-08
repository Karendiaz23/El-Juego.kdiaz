export function render(ctx, state) {
  ctx.clearRect(0, 0, 800, 600);

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#444";
  ctx.fillRect(0, 550, 800, 50);

  if (!state.platforms) return;

  for (const platform of state.platforms) {
    ctx.fillStyle = "#8b5a2b";

    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }

  if (!state.hasKey) {
    ctx.fillStyle = "gold";

    ctx.beginPath();

    ctx.arc(state.key.x, state.key.y, 15, 0, Math.PI * 2);

    ctx.fill();
  }

  ctx.fillStyle = "#8e44ad";

  ctx.fillRect(
    state.door.x,
    state.door.y,
    state.door.width,
    state.door.height
  );

  Object.values(state.players || {}).forEach((p) => {
    if (!p.color || typeof p.width !== "number") {
      return;
    }

    ctx.fillStyle = p.color;

    ctx.fillRect(p.x, p.y, p.width, p.height);

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x + 28, p.y + 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x + 28, p.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();

    ctx.arc(p.x + 20, p.y + 24, 6, 0, Math.PI);

    ctx.strokeStyle = "black";
    ctx.stroke();
  });

  ctx.fillStyle = "white";

  ctx.font = "24px Arial";

  ctx.fillText("NIVEL " + state.level, 20, 40);

  // SIGUIENTE NIVEL
  if (state.win) {
    ctx.fillStyle = "white";

    ctx.font = "bold 50px Arial";

    ctx.fillText("SIGUIENTE NIVEL", 150, 220);

    ctx.font = "30px Arial";

    ctx.fillText("ENTER PARA CONTINUAR", 150, 280);
  }

  // FINAL DEL JUEGO
  if (state.gameFinished) {
    ctx.fillStyle = "white";

    ctx.font = "bold 80px Arial";

    ctx.fillText("GANASTE", 180, 240);

    ctx.font = "bold 45px Arial";

    ctx.fillText("FIN DEL JUEGO", 210, 320);
  }
}
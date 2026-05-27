export function render(ctx, state) {
  ctx.clearRect(0, 0, 800, 600);

  // fondo
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, 800, 600);

  // piso
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 550, 800, 50);

  // =========================
  // PLATAFORMAS
  // =========================
  if (!state.platforms) return;

  for (const platform of state.platforms) {
    ctx.fillStyle = "#8b5a2b";

    ctx.fillRect(
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }

  // =========================
  // CAJA COOPERATIVA
  // =========================
  if (state.box) {
    ctx.fillStyle = "#c97f2b";

    ctx.fillRect(
      state.box.x,
      state.box.y,
      state.box.width,
      state.box.height
    );

    // bordes madera
    ctx.strokeStyle = "#8b5a2b";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      state.box.x,
      state.box.y,
      state.box.width,
      state.box.height
    );

    // líneas decorativas
    ctx.beginPath();

    ctx.moveTo(
      state.box.x,
      state.box.y
    );

    ctx.lineTo(
      state.box.x + state.box.width,
      state.box.y + state.box.height
    );

    ctx.moveTo(
      state.box.x + state.box.width,
      state.box.y
    );

    ctx.lineTo(
      state.box.x,
      state.box.y + state.box.height
    );

    ctx.stroke();
  }

  // =========================
  // LLAVE
  // =========================
  if (!state.hasKey) {
    ctx.fillStyle = "gold";

    ctx.beginPath();

    ctx.arc(
      state.key.x,
      state.key.y,
      15,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // =========================
  // PUERTA
  // =========================
  ctx.fillStyle = "#8e44ad";

  ctx.fillRect(
    state.door.x,
    state.door.y,
    state.door.width,
    state.door.height
  );

  // pomo puerta
  ctx.fillStyle = "gold";

  ctx.beginPath();

  ctx.arc(
    state.door.x + 38,
    state.door.y + 40,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // =========================
  // JUGADORES
  // =========================
  Object.values(state.players || {}).forEach((p) => {
    if (!p.color || typeof p.width !== "number") {
      return;
    }

    // cuerpo
    ctx.fillStyle = p.color;

    ctx.fillRect(
      p.x,
      p.y,
      p.width,
      p.height
    );

    // ojos
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x + 28, p.y + 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // pupilas
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(p.x + 12, p.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x + 28, p.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // sonrisa
    ctx.beginPath();

    ctx.arc(
      p.x + 20,
      p.y + 24,
      6,
      0,
      Math.PI
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.stroke();
  });

  // =========================
  // HUD
  // =========================
  ctx.fillStyle = "white";

  ctx.font = "24px Arial";

  ctx.fillText(
    "NIVEL " + state.level,
    20,
    40
  );

  // jugadores conectados
  ctx.font = "20px Arial";

  ctx.fillText(
    "JUGADORES: " +
      Object.keys(state.players).length +
      "/4",
    20,
    70
  );

  // estado llave
  ctx.font = "18px Arial";

  if (state.hasKey) {
    ctx.fillStyle = "#4dff88";

    ctx.fillText(
      "LLAVE OBTENIDA",
      20,
      100
    );
  } else {
    ctx.fillStyle = "#ffd24d";

    ctx.fillText(
      "BUSQUEN LA LLAVE",
      20,
      100
    );
  }

  // =========================
  // SIGUIENTE NIVEL
  // =========================
  if (state.win) {
    ctx.fillStyle = "white";

    ctx.font = "bold 50px Arial";

    ctx.fillText(
      "SIGUIENTE NIVEL",
      150,
      220
    );

    ctx.font = "30px Arial";

    ctx.fillText(
      "CARGANDO...",
      260,
      280
    );
  }

  // =========================
  // FINAL DEL JUEGO
  // =========================
  if (state.gameFinished) {
    ctx.fillStyle = "white";

    ctx.font = "bold 80px Arial";

    ctx.fillText(
      "GANASTE",
      180,
      240
    );

    ctx.font = "bold 45px Arial";

    ctx.fillText(
      "FIN DEL JUEGO",
      210,
      320
    );
  }
}
export function render(ctx, state) {
  if (!state) return;

  ctx.clearRect(0, 0, 800, 600);


  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#444";
  ctx.fillRect(0, 550, 800, 50);


  if (state.level === 1 && state.ladder) {
    ctx.fillStyle = "#cd853f";
    ctx.fillRect(state.ladder.x, state.ladder.y, 4, state.ladder.height);

    ctx.fillRect(state.ladder.x + state.ladder.width - 4, state.ladder.y, 4, state.ladder.height);


    ctx.strokeStyle = "#cd853f";
    ctx.lineWidth = 3;
    for (let stepY = state.ladder.y + 15; stepY < state.ladder.y + state.ladder.height; stepY += 20) {
      ctx.beginPath();
      ctx.moveTo(state.ladder.x, stepY);
      ctx.lineTo(state.ladder.x + state.ladder.width, stepY);
      ctx.stroke();
    }
  }

 
  if (state.platforms) {
    for (const platform of state.platforms) {
      ctx.fillStyle = "#8b5a2b"; 
      ctx.fillRect(
        platform.x,
        platform.y,
        platform.width,
        platform.height
      );
    }
  }

  if (state.box) {
    ctx.fillStyle = "#ff00aa";
    ctx.fillRect(
      state.box.x,
      state.box.y,
      state.box.width,
      state.box.height
    );

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      state.box.x,
      state.box.y,
      state.box.width,
      state.box.height
    );

    ctx.beginPath();
    ctx.moveTo(state.box.x, state.box.y);
    ctx.lineTo(state.box.x + state.box.width, state.box.y + state.box.height);
    ctx.moveTo(state.box.x + state.box.width, state.box.y);
    ctx.lineTo(state.box.x, state.box.y + state.box.height);
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  
  if (!state.hasKey && state.key) {
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(
      state.key.x + 12,
      state.key.y + 12,
      10,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillRect(state.key.x + 12, state.key.y + 8, 15, 6);
  }

 
  if (state.door) {
    ctx.fillStyle = "#8e44ad";
    ctx.fillRect(
      state.door.x,
      state.door.y,
      state.door.width,
      state.door.height
    );

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
  }


  Object.values(state.players || {}).forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(
      p.x,
      p.y,
      p.width,
      p.height
    );

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


  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("NIVEL " + state.level, 20, 40);

  ctx.font = "20px Arial";
  ctx.fillText(
    "JUGADORES: " + Object.keys(state.players || {}).length + "/4",
    20,
    70
  );

  ctx.font = "18px Arial";
  if (state.hasKey) {
    ctx.fillStyle = "#4dff88";
    ctx.fillText("LLAVE OBTENIDA", 20, 100);
  } else {
    ctx.fillStyle = "#ffd24d";
    ctx.fillText("BUSQUEN LA LLAVE", 20, 100);
  }

  if (state.win) {
    ctx.fillStyle = "white";
    ctx.font = "bold 50px Arial";
    ctx.fillText("SIGUIENTE NIVEL", 180, 220);

    ctx.font = "30px Arial";
    ctx.fillText("CARGANDO...", 310, 280);
  }

  if (state.gameFinished) {
    ctx.fillStyle = "white";
    ctx.font = "bold 80px Arial";
    ctx.fillText("GANASTE", 220, 240);

    ctx.font = "bold 45px Arial";
    ctx.fillText("FIN DEL JUEGO", 230, 320);
  }
}
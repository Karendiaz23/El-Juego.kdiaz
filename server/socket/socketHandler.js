const MAX_PLAYERS = 4;

const getPlayerCount = (gameState) =>
  Object.keys(gameState.players).length;

module.exports = function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    const isHost = socket.handshake.query.host === "true";

    console.log("=================================");
    console.log("NUEVA CONEXIÓN");
    console.log("ID:", socket.id);
    console.log("ES HOST:", isHost);

    // 🔥 HOST NO PARTICIPA COMO JUGADOR
    if (isHost) {
      console.log("HOST CONECTADO");
      return;
    }

    // 🔥 LIMITE DE JUGADORES (ROBUSTO)
    const currentPlayers = getPlayerCount(gameState);

    if (currentPlayers >= MAX_PLAYERS) {
      console.log("SERVIDOR LLENO:", socket.id);

      socket.emit("serverFull", {
        message: "Servidor lleno (máx 4 jugadores)",
      });

      socket.disconnect(true);
      return;
    }

    // 🔥 EVITAR DUPLICADOS SIN ROMPER RECONEXIÓN
    if (gameState.players[socket.id]) {
      console.log("RECONEXIÓN DETECTADA:", socket.id);
    } else {
      console.log("JUGADOR CONECTADO:", socket.id);
      gameState.addPlayer(socket.id);
    }

    console.log("TOTAL JUGADORES:", getPlayerCount(gameState));

    // =========================
    // INPUTS
    // =========================

    socket.on("keydown", (data) => {
      gameState.keyDown(socket.id, data.key);
    });

    socket.on("keyup", (data) => {
      gameState.keyUp(socket.id, data.key);
    });

    socket.on("nextLevel", () => {
      console.log("SIGUIENTE NIVEL");
      gameState.nextLevel();
    });

    socket.on("disconnect", () => {
      console.log("DESCONECTADO:", socket.id);

      if (gameState.players[socket.id]) {
        gameState.removePlayer(socket.id);
      }

      console.log("JUGADORES RESTANTES:", getPlayerCount(gameState));
    });
  });
};
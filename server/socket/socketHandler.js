const MAX_PLAYERS = 4;

module.exports = function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    const isHost = socket.handshake.query.host === "true";

    console.log("=================================");
    console.log("NUEVA CONEXIÓN");
    console.log("ID:", socket.id);
    console.log("ES HOST:", isHost);

    if (isHost) {
      console.log("HOST CONECTADO");
      return;
    }

    // 🔥 LIMITE DE JUGADORES
    const currentPlayers = Object.keys(gameState.players).length;

    if (currentPlayers >= MAX_PLAYERS) {
      console.log("SERVIDOR LLENO:", socket.id);

      socket.emit("serverFull", {
        message: "Servidor lleno (máx 4 jugadores)",
      });

      socket.disconnect();
      return;
    }

    // 🔥 EVITAR DUPLICADOS PERO SIN ROMPER FLUJO
    if (!gameState.players[socket.id]) {
      console.log("JUGADOR CONECTADO:", socket.id);
      gameState.addPlayer(socket.id);
    } else {
      console.log("RECONEXIÓN DETECTADA:", socket.id);
    }

    console.log(
      "TOTAL JUGADORES:",
      Object.keys(gameState.players).length
    );

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

      gameState.removePlayer(socket.id);

      console.log(
        "JUGADORES RESTANTES:",
        Object.keys(gameState.players).length
      );
    });
  });
};
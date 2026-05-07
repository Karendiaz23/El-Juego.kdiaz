module.exports = function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    const isHost = socket.handshake.query.host === "true";

    if (!isHost) {
      console.log("Jugador conectado:", socket.id);

      gameState.addPlayer(socket.id);
    }

    socket.on("move", (movement) => {
      if (!isHost) {
        gameState.movePlayer(socket.id, movement);
      }
    });

    socket.on("stop", () => {
      if (!isHost) {
        gameState.stopPlayer(socket.id);
      }
    });

    socket.on("nextLevel", () => {
      gameState.nextLevel();
    });

    socket.on("disconnect", () => {
      if (!isHost) {
        console.log("Jugador desconectado:", socket.id);

        gameState.removePlayer(socket.id);
      }
    });
  });
};

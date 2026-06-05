const MAX_PLAYERS = 4;

const connectedIPs = {};

const getPlayerCount = (gameState) =>
  Object.keys(gameState.players).length;

module.exports = function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    const isHost = socket.handshake.query.host === "true";

    const clientIP =
      socket.handshake.address ||
      socket.conn.remoteAddress;

    console.log("=================================");
    console.log("NUEVA CONEXIÓN");
    console.log("ID:", socket.id);
    console.log("IP:", clientIP);
    console.log("ES HOST:", isHost);

  
    if (isHost) {
      console.log("HOST CONECTADO");
      return;
    }

  
    if (connectedIPs[clientIP]) {
      const oldSocketId = connectedIPs[clientIP];

      console.log("SOCKET VIEJO ENCONTRADO:", oldSocketId);

      if (gameState.players[oldSocketId]) {
        gameState.removePlayer(oldSocketId);

        console.log("JUGADOR FANTASMA ELIMINADO");
      }

      const oldSocket = io.sockets.sockets.get(oldSocketId);

      if (oldSocket) {
        oldSocket.disconnect(true);

        console.log("SOCKET VIEJO DESCONECTADO");
      }
    }

    connectedIPs[clientIP] = socket.id;


    const currentPlayers = getPlayerCount(gameState);

    if (currentPlayers >= MAX_PLAYERS) {
      console.log("SERVIDOR LLENO:", socket.id);

      socket.emit("serverFull", {
        message: "Servidor lleno (máx 4 jugadores)",
      });

      socket.disconnect(true);
      return;
    }

    console.log("JUGADOR CONECTADO:", socket.id);

    gameState.addPlayer(socket.id);

    console.log(
      "TOTAL JUGADORES:",
      getPlayerCount(gameState)
    );

  
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

      if (connectedIPs[clientIP] === socket.id) {
        delete connectedIPs[clientIP];
      }

      console.log(
        "JUGADORES RESTANTES:",
        getPlayerCount(gameState)
      );
    });
  });
};
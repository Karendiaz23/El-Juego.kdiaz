const MAX_PLAYERS = 4;

// 🔥 guarda qué socket pertenece a cada celular
const connectedIPs = {};

const getPlayerCount = (gameState) =>
  Object.keys(gameState.players).length;

module.exports = function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    const isHost = socket.handshake.query.host === "true";

    // 🔥 IP REAL DEL CLIENTE
    const clientIP =
      socket.handshake.address ||
      socket.conn.remoteAddress;

    console.log("=================================");
    console.log("NUEVA CONEXIÓN");
    console.log("ID:", socket.id);
    console.log("IP:", clientIP);
    console.log("ES HOST:", isHost);

    // =========================
    // HOST
    // =========================
    if (isHost) {
      console.log("HOST CONECTADO");
      return;
    }

    // =========================
    // EVITAR JUGADORES FANTASMAS
    // =========================

    // si esa IP ya tenía un socket viejo
    if (connectedIPs[clientIP]) {
      const oldSocketId = connectedIPs[clientIP];

      console.log("SOCKET VIEJO ENCONTRADO:", oldSocketId);

      // borrar jugador viejo
      if (gameState.players[oldSocketId]) {
        gameState.removePlayer(oldSocketId);

        console.log("JUGADOR FANTASMA ELIMINADO");
      }

      // desconectar socket viejo
      const oldSocket = io.sockets.sockets.get(oldSocketId);

      if (oldSocket) {
        oldSocket.disconnect(true);

        console.log("SOCKET VIEJO DESCONECTADO");
      }
    }

    // guardar nuevo socket
    connectedIPs[clientIP] = socket.id;

    // =========================
    // LIMITE DE JUGADORES
    // =========================
    const currentPlayers = getPlayerCount(gameState);

    if (currentPlayers >= MAX_PLAYERS) {
      console.log("SERVIDOR LLENO:", socket.id);

      socket.emit("serverFull", {
        message: "Servidor lleno (máx 4 jugadores)",
      });

      socket.disconnect(true);
      return;
    }

    // =========================
    // CREAR JUGADOR
    // =========================
    console.log("JUGADOR CONECTADO:", socket.id);

    gameState.addPlayer(socket.id);

    console.log(
      "TOTAL JUGADORES:",
      getPlayerCount(gameState)
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

    // =========================
    // DESCONECTAR
    // =========================
    socket.on("disconnect", () => {
      console.log("DESCONECTADO:", socket.id);

      // borrar jugador
      if (gameState.players[socket.id]) {
        gameState.removePlayer(socket.id);
      }

      // limpiar IP guardada
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
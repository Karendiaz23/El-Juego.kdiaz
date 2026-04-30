const players = {};

function addPlayer(id) {
  players[id] = { x: 100, y: 100 };
}

function updatePlayer(id, input) {
  const player = players[id];
  if (!player) return;

  player.x += input.x;
  player.y += input.y;
}

function setupSocket(io, gameState) {
  io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id);

    addPlayer(socket.id);

    socket.on("move", (input) => {
      updatePlayer(socket.id, input);
    });

    socket.on("disconnect", () => {
      console.log("Jugador desconectado:", socket.id);
      delete players[socket.id];
    });
  });
}

module.exports = setupSocket;
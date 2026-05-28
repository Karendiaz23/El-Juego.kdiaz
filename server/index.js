const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");

const setupSocket = require("./socket/socketHandler");
const GameState = require("./game/gameState");

const app = express();
const server = http.createServer(app);
app.use(express.static("../host"));

// 🔥 SERVIR INDEX.HTML Y JS
app.use(express.static(__dirname));

// 🔍 OBTENER IP LOCAL
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return "localhost";
}

const localIP = getLocalIP();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const gameState = new GameState();

// 🔌 SOCKETS
setupSocket(io, gameState);

// 🎮 GAME LOOP
setInterval(() => {
  gameState.update();

  io.emit("gameState", {
    players: gameState.players,
    level: gameState.level,
    key: gameState.key,
    door: gameState.door,
    platforms: gameState.platforms,
    hasKey: gameState.hasKey,
    win: gameState.win,
    gameFinished: gameState.gameFinished,
  });
}, 1000 / 30);

// 🚀 SERVER
server.listen(3000, () => {
  console.log("\n=============================");
  console.log("🎮 PICO PARK INICIADO");
  console.log("=============================\n");

  console.log(`🌐 http://${localIP}:3000\n`);
});
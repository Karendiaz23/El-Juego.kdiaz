const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const setupSocket = require("./socket/socketHandler");
const GameState = require("./game/gameState");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const gameState = new GameState();

// 🔌 SOCKETS
setupSocket(io, gameState);

// 🎮 GAME LOOP (30 FPS)
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

// 🚀 SERVER START
server.listen(3000, () => {
  console.log("Servidor Socket.IO iniciado en http://localhost:3000");
});
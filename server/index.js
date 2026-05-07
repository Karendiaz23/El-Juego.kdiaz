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

setupSocket(io, gameState);

setInterval(() => {
  gameState.update();

  io.emit("gameState", {
    level: gameState.level,
    players: gameState.players,
    key: gameState.key,
    door: gameState.door,
    hasKey: gameState.hasKey,
    win: gameState.win,
    platforms: gameState.platforms,
  });
}, 1000 / 30);

server.listen(3000, () => {
  console.log("SERVIDOR EN PUERTO 3000");
});
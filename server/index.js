const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const setupSocket = require("./socket/socketHandler");
const GameState = require("./game/gameState");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gameState = new GameState();

setupSocket(io, gameState);

server.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});
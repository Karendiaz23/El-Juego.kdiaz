const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");

const setupSocket = require("./socket/socketHandler");
const GameState = require("./game/gameState");

const app = express();
const server = http.createServer(app);

app.use(express.static("../host"));

app.use(express.static(__dirname));


function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (
        net.family === "IPv4" &&
        !net.internal
      ) {
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


setupSocket(io, gameState);

setInterval(() => {
  gameState.update();

  io.emit("gameState", {
    players: gameState.players,

    level: gameState.level,

    key: gameState.key,

    door: gameState.door,

    platforms: gameState.platforms,

    box: gameState.box,

    hasKey: gameState.hasKey,

    win: gameState.win,

    gameFinished: gameState.gameFinished,
  });
}, 1000 / 30);


server.listen(3000, "0.0.0.0", () => {
  console.log("\n=============================");
  console.log("🎮 PICO PARK INICIADO");
  console.log("=============================\n");

  console.log(
    `🌐 HOST: http://${localIP}:3000`
  );

  console.log(
    `📱 GAMEPAD IP: ${localIP}:3000\n`
  );
});
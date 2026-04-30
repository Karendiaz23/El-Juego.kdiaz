const players = {};

function addPlayer(id) {
  players[id] = { x: 100, y: 100 };
}

function updatePlayer(id, input) {
  const player = players[id];
  if (!player) return;

  // 🔥 ESTA ES LA LÍNEA MÁS IMPORTANTE
  player.x += input.x;
  player.y += input.y;
}

function removePlayer(id) {
  delete players[id];
}

function getState() {
  return players;
}

module.exports = {
  addPlayer,
  updatePlayer,
  removePlayer,
  getState,
};
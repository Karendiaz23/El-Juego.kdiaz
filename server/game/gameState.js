class GameState {
    constructor() {
      this.players = {};
    }
  
    addPlayer(id) {
      this.players[id] = { x: 100, y: 100 };
    }
  
    updatePlayer(id, input) {
      if (!this.players[id]) return;
      this.players[id].x += input.x;
      this.players[id].y += input.y;
    }
  
    removePlayer(id) {
      delete this.players[id];
    }
  
    getState() {
      return this.players;
    }
  }
  
  module.exports = GameState;
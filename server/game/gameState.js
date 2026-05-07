class GameState {
  constructor() {
    this.level = 1;

    this.players = {};

    this.setupLevel();
  }

  setupLevel() {
    this.hasKey = false;
    this.win = false;

    if (this.level === 1) {
      this.key = {
        x: 580,
        y: 180,
        size: 25,
      };

      this.door = {
        x: 720,
        y: 470,
        width: 50,
        height: 80,
      };

      this.platforms = [
        {
          x: 250,
          y: 430,
          width: 120,
          height: 15,
        },

        {
          x: 450,
          y: 320,
          width: 120,
          height: 15,
        },
      ];
    }

    if (this.level === 2) {
      this.key = {
        x: 620,
        y: 80,
        size: 25,
      };

      this.door = {
        x: 720,
        y: 470,
        width: 50,
        height: 80,
      };

      this.platforms = [
        {
          x: 350,
          y: 380,
          width: 120,
          height: 15,
        },

        {
          x: 520,
          y: 230,
          width: 120,
          height: 15,
        },
      ];
    }

    for (const id in this.players) {
      this.players[id].x = 100;
      this.players[id].y = 500;
    }
  }

  nextLevel() {
    this.level++;

    if (this.level > 2) {
      this.level = 1;
    }

    this.setupLevel();
  }

  addPlayer(id) {
    this.players[id] = {
      x: 100 + Math.random() * 100,
      y: 500,

      width: 40,
      height: 40,

      velocityX: 0,
      velocityY: 0,

      jumpForce: -16,

      color: this.randomColor(),
    };
  }

  movePlayer(id, movement) {
    const player = this.players[id];

    if (!player) return;

    player.velocityX = movement.x;

    if (movement.jump && player.velocityY === 0) {
      player.velocityY = player.jumpForce;
    }
  }

  stopPlayer(id) {
    const player = this.players[id];

    if (!player) return;

    player.velocityX = 0;
  }

  update() {
    for (const id in this.players) {
      const p = this.players[id];

      p.x += p.velocityX;

      p.velocityY += 0.8;

      p.y += p.velocityY;

      if (p.x < 0) {
        p.x = 0;
      }

      if (p.x + p.width > 800) {
        p.x = 800 - p.width;
      }

      if (p.y > 510) {
        p.y = 510;
        p.velocityY = 0;
      }

      for (const platform of this.platforms) {
        const touchingTop =
          p.x + p.width > platform.x &&
          p.x < platform.x + platform.width &&
          p.y + p.height >= platform.y &&
          p.y + p.height <= platform.y + 15 &&
          p.velocityY >= 0;

        if (touchingTop) {
          p.y = platform.y - p.height;
          p.velocityY = 0;
        }

        const touchingLeft =
          p.x + p.width >= platform.x &&
          p.x < platform.x &&
          p.y + p.height > platform.y &&
          p.y < platform.y + platform.height;

        if (touchingLeft && p.velocityX > 0) {
          p.x = platform.x - p.width;
        }

        const touchingRight =
          p.x <= platform.x + platform.width &&
          p.x + p.width > platform.x + platform.width &&
          p.y + p.height > platform.y &&
          p.y < platform.y + platform.height;

        if (touchingRight && p.velocityX < 0) {
          p.x = platform.x + platform.width;
        }
      }

      if (
        !this.hasKey &&
        p.x < this.key.x + this.key.size &&
        p.x + p.width > this.key.x &&
        p.y < this.key.y + this.key.size &&
        p.y + p.height > this.key.y
      ) {
        this.hasKey = true;
      }
    }

    if (this.hasKey) {
      let playersAtDoor = 0;

      for (const id in this.players) {
        const p = this.players[id];

        const insideDoor =
          p.x + p.width > this.door.x &&
          p.x < this.door.x + this.door.width &&
          p.y + p.height > this.door.y;

        if (insideDoor) {
          playersAtDoor++;
        }
      }

      const totalPlayers = Object.keys(this.players).length;

      if (playersAtDoor === totalPlayers && totalPlayers > 0) {
        this.win = true;
      }
    }
  }

  removePlayer(id) {
    delete this.players[id];
  }

  randomColor() {
    const colors = ["#ff4d4d", "#4da6ff", "#4dff88", "#ffd24d"];

    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = GameState;

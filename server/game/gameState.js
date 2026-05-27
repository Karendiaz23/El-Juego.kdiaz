class GameState {
  constructor() {
    this.level = 1;
    this.players = {};
    this.gameFinished = false;

    this.win = false;
    this.hasKey = false;
    this._changingLevel = false;

    this.setupLevel();
  }

  setupLevel() {
    this.hasKey = false;
    this.win = false;
    this._changingLevel = false;

    // =========================
    // NIVEL 1
    // =========================
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

      // CAJA NIVEL 1
      this.box = {
        x: 350,
        y: 460,
        width: 50,
        height: 50,
        velocityX: 0,
      };
    }

    // =========================
    // NIVEL 2 DIFÍCIL
    // =========================
    if (this.level === 2) {
      this.key = {
        x: 710,
        y: 20,
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
          x: 220,
          y: 430,
          width: 110,
          height: 15,
        },

        {
          x: 420,
          y: 320,
          width: 100,
          height: 15,
        },

        {
          x: 640,
          y: 140,
          width: 70,
          height: 15,
        },
      ];

      // CAJA OBLIGATORIA
      this.box = {
        x: 40,
        y: 460,
        width: 60,
        height: 50,
        velocityX: 0,
      };
    }

    // RESET JUGADORES
    for (const id in this.players) {
      this.players[id].x = 100;
      this.players[id].y = 500;
      this.players[id].velocityX = 0;
      this.players[id].velocityY = 0;
    }
  }

  nextLevel() {
    if (this.gameFinished) return;

    if (this.level === 1) {
      this.level = 2;
      this.setupLevel();
      return;
    }

    this.gameFinished = true;
  }

  addPlayer(id) {
    this.players[id] = {
      x: 100 + Math.random() * 80,
      y: 500,

      width: 40,
      height: 40,

      velocityX: 0,
      velocityY: 0,

      jumpForce: -16,

      color: this.randomColor(),
    };
  }

  keyDown(id, key) {
    const p = this.players[id];

    if (!p) return;

    if (key === "left") p.velocityX = -5;

    if (key === "right") p.velocityX = 5;

    if (key === "jump" && p.velocityY === 0) {
      p.velocityY = p.jumpForce;
    }
  }

  keyUp(id, key) {
    const p = this.players[id];

    if (!p) return;

    if (key === "left" || key === "right") {
      p.velocityX = 0;
    }
  }

  update() {
    const playerList = Object.values(this.players);

    // RESET VELOCIDAD CAJA
    if (this.box) {
      this.box.velocityX = 0;
    }

    for (const id in this.players) {
      const p = this.players[id];

      // =========================
      // MOVIMIENTO
      // =========================
      p.x += p.velocityX;

      p.velocityY += 0.8;

      p.y += p.velocityY;

      // límites
      if (p.x < 0) p.x = 0;

      if (p.x + p.width > 800) {
        p.x = 800 - p.width;
      }

      // piso
      if (p.y > 510) {
        p.y = 510;
        p.velocityY = 0;
      }

      // =========================
      // PLATAFORMAS
      // =========================
      for (const platform of this.platforms) {
        const onTop =
          p.x + p.width > platform.x &&
          p.x < platform.x + platform.width &&
          p.y + p.height >= platform.y &&
          p.y + p.height <= platform.y + 15 &&
          p.velocityY >= 0;

        if (onTop) {
          p.y = platform.y - p.height;
          p.velocityY = 0;
        }
      }

      // =========================
      // SUBIRSE A LA CAJA
      // =========================
      if (this.box) {
        const onBox =
          p.x + p.width > this.box.x &&
          p.x < this.box.x + this.box.width &&
          p.y + p.height >= this.box.y &&
          p.y + p.height <= this.box.y + 20 &&
          p.velocityY >= 0;

        if (onBox) {
          p.y = this.box.y - p.height;
          p.velocityY = 0;
        }
      }

      // =========================
      // COLISIÓN JUGADORES
      // =========================
      for (const other of playerList) {
        if (other === p) continue;

        const overlapX =
          p.x < other.x + other.width &&
          p.x + p.width > other.x;

        const overlapY =
          p.y < other.y + other.height &&
          p.y + p.height > other.y;

        if (!overlapX || !overlapY) continue;

        const prevBottom =
          p.y + p.height - p.velocityY;

        // STACK
        const landing =
          p.velocityY >= 0 &&
          prevBottom <= other.y + 6 &&
          p.y + p.height >= other.y;

        if (landing) {
          p.y = other.y - p.height;
          p.velocityY = 0;
          continue;
        }

        // EMPUJE
        const overlapLeft =
          (p.x + p.width) - other.x;

        const overlapRight =
          (other.x + other.width) - p.x;

        if (overlapLeft < overlapRight) {
          p.x = other.x - p.width;
        } else {
          p.x = other.x + other.width;
        }

        p.velocityX = 0;
      }

      // =========================
      // EMPUJAR CAJA
      // =========================
      if (this.box) {
        const touchingBox =
          p.x + p.width > this.box.x &&
          p.x < this.box.x + this.box.width &&
          p.y + p.height > this.box.y &&
          p.y < this.box.y + this.box.height;

        if (touchingBox) {
          if (p.velocityX > 0) {
            this.box.velocityX += 2;
          }

          if (p.velocityX < 0) {
            this.box.velocityX -= 2;
          }
        }
      }

      // =========================
      // LLAVE
      // =========================
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

    // =========================
    // UPDATE CAJA
    // =========================
    if (this.box) {
      this.box.x += this.box.velocityX;

      if (this.box.x < 0) {
        this.box.x = 0;
      }

      if (this.box.x + this.box.width > 800) {
        this.box.x = 800 - this.box.width;
      }
    }

    // =========================
    // WIN
    // =========================
    if (
      this.hasKey &&
      !this.gameFinished &&
      !this._changingLevel
    ) {
      let count = 0;

      for (const id in this.players) {
        const p = this.players[id];

        const inside =
          p.x + p.width > this.door.x &&
          p.x < this.door.x + this.door.width &&
          p.y + p.height > this.door.y;

        if (inside) count++;
      }

      const total =
        Object.keys(this.players).length;

      if (count === total && total > 0) {
        this.win = true;
        this._changingLevel = true;

        setTimeout(() => {
          this.win = false;
          this._changingLevel = false;

          this.nextLevel();
        }, 700);
      }
    }
  }

  removePlayer(id) {
    delete this.players[id];
  }

  randomColor() {
    const colors = [
      "#ff4d4d",
      "#4da6ff",
      "#4dff88",
      "#ffd24d",
    ];

    return colors[
      Math.floor(Math.random() * colors.length)
    ];
  }
}

module.exports = GameState;
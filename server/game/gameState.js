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

      this.ladder = {
        x: 210,
        y: 430,
        width: 30,
        height: 120
      };

      this.box = null;
      this.spikes = null;
    }


    if (this.level === 2) {
      this.key = {
        x: 385,
        y: 120,
        size: 25,
      };

      this.door = {
        x: 730,
        y: 470,
        width: 50,
        height: 80,
      };

      this.platforms = [
        {
          x: 340,
          y: 220,
          width: 120,
          height: 15,
        },
        {
          x: 550,
          y: 380,
          width: 30,
          height: 170,
        },
        {
          x: 620,
          y: 300,
          width: 100,
          height: 15,
        }
      ];

      this.ladder = null;
      this.spikes = null;

      this.box = {
        x: 80, 
        y: 500,
        width: 60,
        height: 50,
        velocityX: 0,
        velocityY: 0,
        color: "#ff00aa",
      };
    }

    for (const id in this.players) {
      this.players[id].x = 60;
      this.players[id].y = 510;
      this.players[id].velocityX = 0;
      this.players[id].velocityY = 0;
      this.players[id].climbing = false;
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
      x: 60 + Math.random() * 40,
      y: 510,
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      jumpForce: -16,
      color: this.randomColor(),
      climbing: false,
    };
  }

  keyDown(id, key) {
    const p = this.players[id];
    if (!p) return;

    if (key === "left") p.velocityX = -5;
    if (key === "right") p.velocityX = 5;
    if (key === "up") p.climbing = true; 
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
    if (key === "up") {
      p.climbing = false;
    }
  }

  update() {
    const playerList = Object.values(this.players);

    let empujandoDerecha = 0;
    let empujandoIzquierda = 0;

    for (const id in this.players) {
      const p = this.players[id];

      let insideLadder = false;
      if (this.level === 1 && this.ladder) {
        insideLadder = 
          p.x + p.width > this.ladder.x &&
          p.x < this.ladder.x + this.ladder.width &&
          p.y + p.height > this.ladder.y &&
          p.y < this.ladder.y + this.ladder.height;
      }

      p.x += p.velocityX;

      if (insideLadder) {
        p.velocityY = 0;
        if (p.climbing) p.y -= 4;
      } else {
        p.velocityY += 0.8;
      }
      p.y += p.velocityY;

      if (p.x < 0) p.x = 0;
      if (p.x + p.width > 800) p.x = 800 - p.width;
      if (p.y > 510) {
        p.y = 510;
        p.velocityY = 0;
      }

      for (const platform of this.platforms) {
        const insideX = p.x + p.width > platform.x && p.x < platform.x + platform.width;
        const onTop = insideX && p.y + p.height >= platform.y && p.y + p.height <= platform.y + 15 && p.velocityY >= 0;

        if (onTop) {
          p.y = platform.y - p.height;
          p.velocityY = 0;
        } 
        else if (p.y + p.height > platform.y && p.y < platform.y + platform.height) {
          if (p.x + p.width > platform.x && p.x - p.velocityX <= platform.x) {
            p.x = platform.x - p.width;
          } else if (p.x < platform.x + platform.width && p.x - p.velocityX >= platform.x + platform.width) {
            p.x = platform.x + platform.width;
          }
        }
      }

      if (this.box) {
        const onBox = p.x + p.width > this.box.x && p.x < this.box.x + this.box.width && p.y + p.height >= this.box.y && p.y + p.height <= this.box.y + 12 && p.velocityY >= 0;
        if (onBox) {
          p.y = this.box.y - p.height;
          p.velocityY = 0;
        }
      }

      if (this.box) {
        const tocandoX = p.x + p.width >= this.box.x - 4 && p.x <= this.box.x + this.box.width + 4;
        const tocandoY = p.y < this.box.y + this.box.height && p.y + p.height > this.box.y;

        if (tocandoX && tocandoY) {
          if (p.velocityX > 0 && p.x < this.box.x) {
            empujandoDerecha++;
            p.x = this.box.x - p.width;
          }
          if (p.velocityX < 0 && p.x > this.box.x) {
            empujandoIzquierda++;
            p.x = this.box.x + this.box.width;
          }
        }
      }

      for (const other of playerList) {
        if (other === p) continue;

        const overlapX = p.x < other.x + other.width && p.x + p.width > other.x;
        const overlapY = p.y < other.y + other.height && p.y + p.height > other.y;

        if (overlapX && overlapY) {
          const prevBottom = p.y + p.height - p.velocityY;
          
          if (p.velocityY >= 0 && prevBottom <= other.y + 8) {
            p.y = other.y - p.height;
            p.velocityY = 0;
          }
        }
      }

      if (!this.hasKey && p.x < this.key.x + this.key.size && p.x + p.width > this.key.x && p.y < this.key.y + this.key.size && p.y + p.height > this.key.y) {
        this.hasKey = true;
      }
    }

    
    if (this.box) {
      const VELOCIDAD_BASE = 3;

      if (empujandoDerecha > 0) {
        this.box.velocityX = VELOCIDAD_BASE * empujandoDerecha;
      } else if (empujandoIzquierda > 0) {
        this.box.velocityX = -VELOCIDAD_BASE * empujandoIzquierda;
      } else {
        this.box.velocityX = 0;
      }

      this.box.velocityY += 0.8;
      this.box.x += this.box.velocityX;
      this.box.y += this.box.velocityY;

      if (this.box.x < 0) this.box.x = 0;
      if (this.box.x + this.box.width > 800) this.box.x = 800 - this.box.width;
      if (this.box.y > 500) {
        this.box.y = 500;
        this.box.velocityY = 0;
      }

      for (const platform of this.platforms) {
        const insideBoxX = this.box.x + this.box.width > platform.x && this.box.x < platform.x + platform.width;
        const boxOnPlatform = insideBoxX && this.box.y + this.box.height >= platform.y && this.box.y + this.box.height <= platform.y + 15 && this.box.velocityY >= 0;

        if (boxOnPlatform) {
          this.box.y = platform.y - this.box.height;
          this.box.velocityY = 0;
        }
        else if (this.box.y + this.box.height > platform.y && this.box.y < platform.y + platform.height) {
          if (this.box.x + this.box.width > platform.x && this.box.x - this.box.velocityX <= platform.x) {
            this.box.x = platform.x - this.box.width;
          } else if (this.box.x < platform.x + platform.width && this.box.x - this.box.velocityX >= platform.x + platform.width) {
            this.box.x = platform.x + platform.width;
          }
        }
      }

      if (this.box.y > 600) {
        this.box.x = 80;
        this.box.y = 500;
        this.box.velocityY = 0;
      }
    }

 
    if (this.hasKey && !this.gameFinished && !this._changingLevel) {
      let count = 0;
      for (const id in this.players) {
        const p = this.players[id];
        const inside = p.x + p.width > this.door.x && p.x < this.door.x + this.door.width && p.y + p.height > this.door.y;
        if (inside) count++;
      }
      const total = Object.keys(this.players).length;
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
    const colors = ["#ff4d4d", "#4da6ff", "#4dff88", "#ffd24d"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = GameState;
export function render(ctx, players) {
    ctx.clearRect(0, 0, 800, 600);
  
    for (let id in players) {
      const p = players[id];
  
      ctx.fillStyle = "blue";
      ctx.fillRect(p.x, p.y, 50, 50);
    }
  }
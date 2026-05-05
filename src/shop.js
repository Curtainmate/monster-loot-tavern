class Shopkeeper {
  constructor() {
    this.x = 510;
    this.y = 255;
    this.size = 30;
  }

  nearby(player) {
    return Math.hypot(player.x - this.x, player.y - this.y) < 78;
  }

  draw(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    this.drawSign(camera);
    if (!gameSprites.drawShopkeeper(this, camera)) {
      drawRectSprite(sx, sy, this.size, this.size, "#d89b3d");
      ctx.fillStyle = "#f1c79a";
      ctx.fillRect(Math.floor(sx - 8), Math.floor(sy - 18), 16, 9);
      ctx.fillStyle = "#51321e";
      ctx.fillRect(Math.floor(sx - 11), Math.floor(sy - 23), 22, 7);
    }
  }

  drawSign(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y - 116;
    ctx.save();
    if (!gameSprites.drawImage("sign", sx - 45, sy - 50, 90, 90)) {
      gameSprites.drawTile("sign", sx - 36, sy - 48, 72);
    }
    ctx.font = "800 15px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffe18a";
    ctx.strokeStyle = "#2b1609";
    ctx.lineWidth = 3;
    ctx.strokeText("SHOP", Math.floor(sx), Math.floor(sy - 15));
    ctx.fillText("SHOP", Math.floor(sx), Math.floor(sy - 15));
    ctx.restore();
  }
}

class Shop {
  constructor(game) {
    this.game = game;
  }

  sellItem(uniqueId) {
    const p = this.game.player;
    const item = p.items.find((candidate) => candidate.uniqueId === uniqueId);
    if (!item || p.isItemEquipped(uniqueId)) return;
    p.removeItem(uniqueId);
    p.gold += item.sellValue;
    this.game.totalGoldEarned += item.sellValue;
    this.game.questProgress.gold += item.sellValue;
    this.game.addDangerProgress(Math.max(1, Math.floor(item.sellValue / CONFIG.dangerProgress.saleGoldDivisor)), "stage progress");
    this.game.audio.play("sell");
    this.game.ui.renderShop();
    if (this.game.inventoryOpen) this.game.ui.renderInventory();
  }

  sellAll() {
    for (const item of [...this.game.player.items]) {
      this.sellItem(item.uniqueId);
    }
    this.game.ui.renderShop();
  }
}


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

  sellItem(name) {
    const p = this.game.player;
    if (!p.inventory[name]) return;
    p.inventory[name] -= 1;
    p.gold += CONFIG.lootValues[name];
    this.game.totalGoldEarned += CONFIG.lootValues[name];
    this.game.questProgress.gold += CONFIG.lootValues[name];
    this.game.addDangerProgress(Math.max(1, Math.floor(CONFIG.lootValues[name] / CONFIG.dangerProgress.saleGoldDivisor)), "stage progress");
    this.game.audio.play("sell");
    this.game.ui.renderShop();
  }

  sellAll() {
    for (const name of Object.keys(CONFIG.lootValues)) {
      while (this.game.player.inventory[name] > 0) {
        this.sellItem(name);
      }
    }
    this.game.ui.renderShop();
  }

  buyItem(id) {
    const item = this.game.availableShopItems().find((candidate) => candidate.id === id);
    const p = this.game.player;
    if (!item || p.gold < item.price) return;
    if (item.type === "upgrade" && p.upgradeLevels[item.chain] !== item.level - 1) return;

    p.gold -= item.price;
    if (item.type === "upgrade") {
      if (item.damage) p.baseDamage += item.damage;
      if (item.health) {
        p.maxHealth += item.health;
        p.health = p.maxHealth;
      }
      if (item.speed) p.speed += item.speed;
      if (item.bonusDamage) p.bonusDamage += item.bonusDamage;
      if (item.arrowSpeed) p.arrowSpeed += item.arrowSpeed;
      if (item.arrowRange) p.arrowRange += item.arrowRange;
      if (item.arrowPierce) p.arrowPierce += item.arrowPierce;
      if (item.cooldownReduction) p.attackCooldown = Math.max(0.18, p.attackCooldown - item.cooldownReduction);
      p.upgradeLevels[item.chain] = item.level;
      p.upgrades.add(item.id);
    } else if (item.id === "healingPotion") {
      p.health = Math.min(p.maxHealth, p.health + 35);
    }
    this.game.audio.play("buy");
    this.game.ui.renderShop();
  }

  buyMastery(id) {
    const item = this.game.availableMasteryItems().find((candidate) => candidate.id === id);
    const p = this.game.player;
    if (!item || p.gold < item.price) return;
    if (p.masteryLevels[item.chain] !== item.currentLevel) return;

    p.gold -= item.price;
    if (item.extraSwings) p.extraSwings += item.extraSwings;
    if (item.extraArrows) p.extraArrows += item.extraArrows;
    if (item.arrowPierce) p.arrowPierce += item.arrowPierce;
    if (item.longRangeBonus) p.longRangeBonus += item.longRangeBonus;
    if (item.bossDamageBonus) p.bossDamageBonus += item.bossDamageBonus;
    if (item.momentumReduction) p.momentumReduction = item.momentumReduction;
    if (item.momentumDuration) p.momentumDuration = item.momentumDuration;
    p.masteryLevels[item.chain] = item.currentLevel + 1;
    this.game.audio.play("buy");
    this.game.ui.renderShop();
  }
}


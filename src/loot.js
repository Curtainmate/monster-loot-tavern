class LootItem {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = 16;
    this.life = 0;
    this.color = {
      "Slime Gel": "#72e782",
      "Goblin Ear": "#b7d276",
      "Wolf Pelt": "#d8d1bd",
      "Rusty Dagger": "#a7aeb9",
      "Monster Fang": "#efe2b4"
    }[name] || "#fff";
  }

  update(dt) {
    this.life += dt;
  }

  draw(camera) {
    if (gameSprites.drawLoot(this, camera)) {
      if (Math.floor(this.life * 4) % 2 === 0) {
        ctx.fillStyle = "#fff6ba";
        ctx.fillRect(Math.floor(this.x - camera.x + 10), Math.floor(this.y - camera.y - 14), 3, 3);
      }
      return;
    }

    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 5) * 2;
    ctx.fillStyle = "rgba(255, 246, 180, 0.28)";
    ctx.fillRect(Math.floor(sx - 10), Math.floor(sy - 10), 20, 20);
    drawRectSprite(sx, sy, this.size, this.size, this.color);
    if (Math.floor(this.life * 4) % 2 === 0) {
      ctx.fillStyle = "#fff6ba";
      ctx.fillRect(Math.floor(sx + 8), Math.floor(sy - 10), 3, 3);
    }
  }
}

class CoinDrop {
  constructor(type, x, y) {
    this.type = type;
    this.data = CONFIG.coins[type] || CONFIG.coins.bronze;
    this.name = this.data.name;
    this.value = this.data.value;
    this.x = x;
    this.y = y;
    this.size = 16;
    this.life = 0;
  }

  update(dt) {
    this.life += dt;
  }

  draw(camera) {
    if (gameSprites.drawCoin(this, camera)) {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.globalAlpha = 0.65 + Math.sin(this.life * 8) * 0.18;
      ctx.fillStyle = "#fff1a8";
      ctx.fillRect(Math.floor(sx + 9), Math.floor(sy - 13), 3, 3);
      ctx.globalAlpha = 1;
      return;
    }

    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 5.8) * 2;
    const color = this.type === "gold" ? "#f5c84d" : this.type === "silver" ? "#d8e1e8" : "#c98348";
    drawRectSprite(sx, sy, this.size, this.size, color);
  }
}

class ItemDrop {
  constructor(item, x, y) {
    this.item = item;
    this.name = item.name;
    this.x = x;
    this.y = y;
    this.size = 22;
    this.life = 0;
    this.noticeCooldown = 0;
    this.color = {
      common: "#f5e6bd",
      uncommon: "#7fe08a",
      rare: "#6fa8ff",
      epic: "#c981ff",
      legendary: "#ffbf4d"
    }[item.rarity] || "#f5e6bd";
  }

  update(dt) {
    this.life += dt;
    this.noticeCooldown = Math.max(0, this.noticeCooldown - dt);
  }

  draw(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 4.8) * 2;
    ctx.save();
    ctx.globalAlpha = 0.28 + Math.sin(this.life * 6) * 0.08;
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(sx - 16), Math.floor(sy - 16), 32, 32);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#21140e";
    ctx.fillRect(Math.floor(sx - 10), Math.floor(sy - 12), 20, 24);
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(sx - 8), Math.floor(sy - 10), 16, 20);
    ctx.fillStyle = "#fff8d9";
    ctx.fillRect(Math.floor(sx - 4), Math.floor(sy - 6), 8, 2);
    ctx.fillRect(Math.floor(sx - 5), Math.floor(sy - 1), 10, 2);
    ctx.restore();
  }
}

class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.data = CONFIG.powerups.types[type] || CONFIG.powerups.types.heart;
    this.name = this.data.name;
    this.x = x;
    this.y = y;
    this.size = 22;
    this.life = 0;
    this.timeLeft = CONFIG.powerups.despawnTime;
    this.color = this.data.color;
  }

  update(dt) {
    this.life += dt;
    this.timeLeft -= dt;
  }

  get expired() {
    return this.timeLeft <= 0;
  }

  collect(game) {
    const player = game.player;
    if (this.type === "heart") {
      const before = player.health;
      player.health = Math.min(player.maxHealth, player.health + CONFIG.powerups.heartHeal);
      const healed = Math.ceil(player.health - before);
      game.floaters.push(new FloatingText(healed > 0 ? `+${healed} Health` : "Health full", player.x, player.y - 34, "#ff9aa5"));
    } else {
      player.addBuff(this.type, this.data.duration);
      game.floaters.push(new FloatingText(this.name, player.x, player.y - 34, this.color));
    }
    game.audio.play("loot");
  }

  draw(camera) {
    if (gameSprites.drawPowerup(this, camera)) {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.globalAlpha = 0.55 + Math.sin(this.life * 8) * 0.18;
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.floor(sx + 11), Math.floor(sy - 18), 3, 3);
      ctx.fillRect(Math.floor(sx - 14), Math.floor(sy + 9), 2, 2);
      ctx.globalAlpha = 1;
      return;
    }

    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 5.4) * 2;
    ctx.fillStyle = "rgba(255, 246, 180, 0.24)";
    ctx.fillRect(Math.floor(sx - 12), Math.floor(sy - 12), 24, 24);
    drawRectSprite(sx, sy, this.size, this.size, this.color);
  }
}

class TreasureChest {
  constructor(x, y, dangerLevel) {
    this.x = x;
    this.y = y;
    this.size = 34;
    this.dangerLevel = dangerLevel;
    this.life = 0;
    this.opened = false;
  }

  update(dt) {
    this.life += dt;
  }

  nearby(player) {
    return Math.hypot(player.x - this.x, player.y - this.y) < 58;
  }

  open(game) {
    if (this.opened) return;
    this.opened = true;
    const baseGold = 18 + this.dangerLevel * 4;
    const bonusGold = Math.floor(Math.random() * (8 + this.dangerLevel * 2));
    const totalGold = Math.max(1, Math.round((baseGold + bonusGold) * (1 + game.player.goldFind)));
    game.dropCoins(totalGold, this.x, this.y);
    game.tryDropGeneratedItem("chest", this.x, this.y - 10);
    game.floaters.push(new FloatingText(`Treasure! +${totalGold} gold`, this.x, this.y - 30, "#ffe18a"));
    game.audio.play("loot");
  }

  draw(camera, showPrompt = false) {
    const sx = this.x - camera.x;
    if (!gameSprites.drawChest(this, camera)) {
      const sy = this.y - camera.y + Math.sin(this.life * 2.4) * 1.5;
      drawRectSprite(sx, sy, this.size, this.size - 8, "#b8793f");
      ctx.fillStyle = "#f3d270";
      ctx.fillRect(Math.floor(sx - 4), Math.floor(sy - 3), 8, 7);
    }
    if (showPrompt) this.drawPrompt(camera);
  }

  drawPrompt(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y - 72 + Math.sin(this.life * 5) * 2;
    ctx.save();
    ctx.font = "700 13px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = "Press E";
    const width = ctx.measureText(text).width + 22;
    ctx.fillStyle = "rgba(25, 14, 7, 0.88)";
    ctx.fillRect(Math.floor(sx - width / 2), Math.floor(sy - 14), width, 28);
    ctx.strokeStyle = "#ffd46b";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.floor(sx - width / 2), Math.floor(sy - 14), width, 28);
    ctx.fillStyle = "#fff0a6";
    ctx.fillText(text, Math.floor(sx), Math.floor(sy + 1));
    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, direction, damage, speed, range, pierce, longRangeDamage = 0, critChance = 0, critDamage = 0) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.dir = { ...direction };
    this.damage = damage;
    this.speed = speed;
    this.range = range;
    this.pierceLeft = pierce;
    this.longRangeDamage = longRangeDamage;
    this.critChance = critChance;
    this.critDamage = critDamage;
    this.size = 10;
    this.dead = false;
    this.hitMonsters = new Set();
  }

  update(dt, game) {
    this.x += this.dir.x * this.speed * dt;
    this.y += this.dir.y * this.speed * dt;
    if (Math.hypot(this.x - this.startX, this.y - this.startY) > this.range || this.x < 0 || this.y < 0 || this.x > CONFIG.world.width || this.y > CONFIG.world.height) {
      this.dead = true;
      return;
    }

    for (const monster of game.monsters) {
      if (this.hitMonsters.has(monster)) continue;
      if (Math.hypot(monster.x - this.x, monster.y - this.y) <= monster.size / 2 + this.size / 2) {
        this.hitMonsters.add(monster);
        const traveled = Math.hypot(this.x - this.startX, this.y - this.startY);
        let multiplier = traveled >= this.range * 0.45 ? 1 + this.longRangeDamage : 1;
        if (Math.random() < clamp(this.critChance, 0, 0.75)) multiplier += this.critDamage || 0.5;
        const damage = Math.max(1, Math.round(this.damage * multiplier));
        monster.takeDamage(damage, this.dir, game);
        game.attackEffects.push({
          x: this.x,
          y: this.y,
          dir: { ...this.dir },
          life: 0.12,
          maxLife: 0.12,
          radius: 22,
          type: "impact"
        });
        if (this.pierceLeft > 0) {
          this.pierceLeft -= 1;
        } else {
          this.dead = true;
        }
        break;
      }
    }
  }

  draw(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    const angle = Math.atan2(this.dir.y, this.dir.x);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillStyle = "#3b2718";
    ctx.fillRect(-8, -2, 15, 4);
    ctx.fillStyle = "#d9d2c1";
    ctx.fillRect(5, -3, 5, 6);
    ctx.fillStyle = "#f5d279";
    ctx.fillRect(-10, -4, 4, 2);
    ctx.fillRect(-10, 2, 4, 2);
    ctx.restore();
  }
}

class FloatingText {
  constructor(text, x, y, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 0.75;
  }

  update(dt) {
    this.life -= dt;
    this.y -= 34 * dt;
  }

  draw(camera) {
    ctx.globalAlpha = clamp(this.life / 0.75, 0, 1);
    ctx.fillStyle = this.color;
    ctx.font = "bold 16px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    ctx.globalAlpha = 1;
  }
}


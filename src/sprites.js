class SpriteSheet {
  constructor() {
    this.images = {};
    this.loaded = {};
    this.frameSize = 144;
    this.chestFrameSize = 160;
    this.powerupFrameSize = 128;
    this.lootSize = 16;
    this.tileSize = 64;
    this.lootFrames = {
      "Slime Gel": 0,
      "Goblin Ear": 1,
      "Wolf Pelt": 2,
      "Rusty Dagger": 3,
      "Monster Fang": 4
    };
    this.powerupFrames = {
      rage: 0,
      heart: 1,
      haste: 2,
      shield: 3,
      cleave: 4
    };
    this.tileFrames = {
      grass: 0,
      grassFlowers: 1,
      dirt: 1,
      tavernFloor: 2,
      wallDark: 3,
      wall: 4,
      door: 5,
      fieldEdge: 6,
      rock: 7,
      tree: 8,
      bush: 9,
      counter: 10,
      sign: 11
    };
    for (const name of ["player", "ranger", "slime", "slime_yellow", "goblin", "goblin_red", "wolf", "wolf_black", "loot", "powerups", "tileset", "chest", "shopkeeper"]) {
      const image = new Image();
      image.onload = () => {
        this.loaded[name] = true;
      };
      image.onerror = () => {
        this.loaded[name] = false;
      };
      image.src = `assets/${name}.png`;
      this.images[name] = image;
      this.loaded[name] = false;
    }

    this.player = [
      [
        { x: -4, y: -8, w: 8, h: 4, color: "#f3c58b" },
        { x: -5, y: -4, w: 10, h: 8, color: "#3d78d8" },
        { x: -6, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 2, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 4, y: -2, w: 5, h: 3, color: "#d9d2c1" }
      ],
      [
        { x: -4, y: -8, w: 8, h: 4, color: "#f3c58b" },
        { x: -5, y: -4, w: 10, h: 8, color: "#4c8deb" },
        { x: -7, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 3, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 4, y: -1, w: 5, h: 3, color: "#d9d2c1" }
      ]
    ];
  }

  drawImageFrame(name, frame, frameWidth, frameHeight, x, y, drawWidth, drawHeight, row = 0, flip = false) {
    const image = this.images[name];
    if (!this.loaded[name] || !image) return false;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (flip) {
      ctx.translate(Math.floor(x + drawWidth), Math.floor(y));
      ctx.scale(-1, 1);
      ctx.drawImage(image, frame * frameWidth, row * frameHeight, frameWidth, frameHeight, 0, 0, drawWidth, drawHeight);
    } else {
      ctx.drawImage(image, frame * frameWidth, row * frameHeight, frameWidth, frameHeight, Math.floor(x), Math.floor(y), drawWidth, drawHeight);
    }
    ctx.restore();
    return true;
  }

  drawPlayer(player, camera) {
    const sx = player.x - camera.x;
    const sy = player.y - camera.y;
    const flash = player.invulnerableLeft > 0 && Math.floor(player.invulnerableLeft * 16) % 2 === 0;
    const attacking = player.cooldownLeft > player.attackCooldown - 0.18;
    const pose = this.directionalPose(player.facing, Math.floor(player.walkFrame) % 2 === 1, attacking);
    const drawSize = 84;
    const drawn = this.drawImageFrame(player.spriteName, pose.frame, this.frameSize, this.frameSize, sx - drawSize / 2, sy - drawSize * 0.76, drawSize, drawSize, 0, pose.flip);
    if (drawn) {
      if (flash) {
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = "#fff6cc";
        ctx.fillRect(Math.floor(sx - 31), Math.floor(sy - 49), 62, 66);
        ctx.globalAlpha = 1;
      }
      return;
    }

    ctx.save();
    if (flash) ctx.globalAlpha = 0.55;
    drawPixelSprite(this.player[Math.floor(player.walkFrame) % 2], sx, sy, 3, player.facing.x < -0.15);
    ctx.restore();
  }

  drawMonster(monster, camera) {
    const sx = monster.x - camera.x;
    const sy = monster.y - camera.y;
    const pose = this.directionalPose({ x: monster.lastMoveX, y: monster.lastMoveY }, Math.floor(monster.walkFrame) % 2 === 1, monster.hitFlash > 0);
    const baseSize = { slime: 62, goblin: 78, wolf: 72 }[monster.type] || 74;
    const drawSize = monster.isBoss ? baseSize * 1.55 : baseSize;
    const drawn = this.drawImageFrame(monster.spriteName, pose.frame, this.frameSize, this.frameSize, sx - drawSize / 2, sy - drawSize * 0.76, drawSize, drawSize, 0, pose.flip);
    if (drawn) {
      if (monster.isBoss) {
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = monster.bossTint;
        ctx.fillRect(Math.floor(sx - drawSize / 2), Math.floor(sy - drawSize * 0.76), drawSize, drawSize);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffe18a";
        ctx.fillRect(Math.floor(sx - 18), Math.floor(sy - monster.size / 2 - 18), 36, 4);
      }
      if (monster.hitFlash > 0) {
        ctx.globalAlpha = 0.32;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.floor(sx - drawSize / 2), Math.floor(sy - drawSize * 0.76), drawSize, drawSize);
        ctx.globalAlpha = 1;
      }
      return;
    }

    const pulse = monster.type === "slime" ? Math.sin(monster.walkFrame) * 2 : 0;
    const color = monster.hitFlash > 0 ? "#ffffff" : monster.color;
    drawRectSprite(sx, sy + pulse, monster.size, monster.size, color);
    if (monster.type === "goblin") {
      ctx.fillStyle = "#ded28b";
      ctx.fillRect(Math.floor(sx - 12), Math.floor(sy - 14), 7, 7);
      ctx.fillRect(Math.floor(sx + 5), Math.floor(sy - 14), 7, 7);
    } else if (monster.type === "wolf") {
      ctx.fillStyle = "#f2f0dd";
      ctx.fillRect(Math.floor(sx - 10), Math.floor(sy + 8), 5, 4);
      ctx.fillRect(Math.floor(sx + 5), Math.floor(sy + 8), 5, 4);
    }
    ctx.fillStyle = "#19120d";
    ctx.fillRect(Math.floor(sx - 6), Math.floor(sy - 4), 4, 4);
    ctx.fillRect(Math.floor(sx + 3), Math.floor(sy - 4), 4, 4);
  }

  drawLoot(loot, camera) {
    const frame = this.lootFrames[loot.name] || 0;
    const sx = loot.x - camera.x;
    const sy = loot.y - camera.y + Math.sin(loot.life * 5) * 2;
    return this.drawImageFrame("loot", frame, 16, 16, sx - 16, sy - 16, 32, 32);
  }

  drawPowerup(powerup, camera) {
    const frame = this.powerupFrames[powerup.type] || 0;
    const sx = powerup.x - camera.x;
    const sy = powerup.y - camera.y + Math.sin(powerup.life * 5.4) * 2;
    return this.drawImageFrame("powerups", frame, this.powerupFrameSize, this.powerupFrameSize, sx - 19, sy - 19, 38, 38);
  }

  drawChest(chest, camera) {
    const frame = chest.opened ? 3 : Math.floor(chest.life * 3) % 3;
    const sx = chest.x - camera.x;
    const sy = chest.y - camera.y + Math.sin(chest.life * 2.4) * 1.5;
    return this.drawImageFrame("chest", frame, this.chestFrameSize, this.chestFrameSize, sx - 39, sy - 58, 78, 78);
  }

  drawShopkeeper(shopkeeper, camera) {
    const sx = shopkeeper.x - camera.x;
    const sy = shopkeeper.y - camera.y;
    return this.drawImageFrame("shopkeeper", 0, 160, 160, sx - 55, sy - 97, 110, 110);
  }

  directionalPose(vector, alternate = false, action = false) {
    if (vector.y < -0.55 && Math.abs(vector.y) > Math.abs(vector.x)) {
      return { frame: alternate || action ? 5 : 1, flip: false };
    }
    if (Math.abs(vector.x) > 0.35) {
      if (vector.x < 0) {
        return { frame: alternate || action ? 6 : 2, flip: false };
      }
      return { frame: alternate || action ? 7 : 3, flip: false };
    }
    return { frame: alternate || action ? 4 : 0, flip: false };
  }

  drawTile(frameName, x, y, size = 32) {
    const frame = this.tileFrames[frameName] || 0;
    const row = frame >= 8 ? 1 : 0;
    const col = frame % 8;
    return this.drawImageFrame("tileset", col, this.tileSize, this.tileSize, x, y, size, size, row);
  }

  drawTiledArea(frameName, worldRect, camera, size = 32, alternateFrame = null) {
    for (let y = worldRect.y; y < worldRect.y + worldRect.height; y += size) {
      for (let x = worldRect.x; x < worldRect.x + worldRect.width; x += size) {
        const frame = alternateFrame && ((x / size + y / size) % 5 === 0) ? alternateFrame : frameName;
        this.drawTile(frame, x - camera.x, y - camera.y, size);
      }
    }
  }
}


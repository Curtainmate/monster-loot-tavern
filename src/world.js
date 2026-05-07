Game.prototype.updateCamera = function() {
    this.camera.x = clamp(this.player.x - canvas.width / 2, 0, CONFIG.world.width - canvas.width);
    this.camera.y = clamp(this.player.y - canvas.height / 2, 0, CONFIG.world.height - canvas.height);
  
};

Game.prototype.playerInTavern = function() {
    return rectContains(CONFIG.tavern, this.player.x, this.player.y);
  
};

Game.prototype.pointInPlayableArea = function(x, y) {
    return rectContains(CONFIG.tavern, x, y)
      || rectContains(CONFIG.transition, x, y)
      || rectContains(CONFIG.field, x, y);
  
};

Game.prototype.collides = function(entity, x, y) {
    const rect = entityRect(entity, x, y);
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > CONFIG.world.width || rect.y + rect.height > CONFIG.world.height) {
      return true;
    }
    if (entity === this.player && !this.pointInPlayableArea(x, y)) {
      return true;
    }
    return CONFIG.blockers.some((blocker) => rectsOverlap(rect, blocker));
  
};

Game.prototype.moveEntity = function(entity, dx, dy, bounds = null) {
    const nextX = entity.x + dx;
    if (!this.collides(entity, nextX, entity.y)) entity.x = nextX;
    const nextY = entity.y + dy;
    if (!this.collides(entity, entity.x, nextY)) entity.y = nextY;

    if (bounds) {
      entity.x = clamp(entity.x, bounds.x + entity.size / 2, bounds.x + bounds.width - entity.size / 2);
      entity.y = clamp(entity.y, bounds.y + entity.size / 2, bounds.y + bounds.height - entity.size / 2);
    }
  
};

Game.prototype.currentStageZone = function() {
    let zone = CONFIG.stageZones[0];
    for (const candidate of CONFIG.stageZones) {
      if (this.dangerLevel >= candidate.minStage) zone = candidate;
    }
    return zone;

};

Game.prototype.drawWorld = function() {
    const zone = this.currentStageZone();
    ctx.fillStyle = zone.theme === "castle" ? "#3d4140" : "#2e6b35";
    ctx.fillRect(-this.camera.x, -this.camera.y, CONFIG.world.width, CONFIG.world.height);

    this.drawField();
    this.drawTavern();
    this.drawScenery();
  
};

Game.prototype.drawTavern = function() {
    const t = CONFIG.tavern;
    const x = t.x - this.camera.x;
    const y = t.y - this.camera.y;
    ctx.fillStyle = "#68401f";
    ctx.fillRect(x, y, t.width, t.height);
    gameSprites.drawTiledArea("tavernFloor", t, this.camera, 32);
    ctx.fillStyle = "#7f512b";
    for (let row = 0; row < t.height; row += 32) {
      ctx.fillRect(x, y + row, t.width, 4);
    }
    for (const prop of CONFIG.scenery.tavern.floorProps) {
      this.drawTavernProp(prop);
    }
    this.drawTavernWalls();
    this.drawTavernDoor();
    for (const prop of CONFIG.scenery.tavern.backProps) {
      this.drawTavernProp(prop);
    }
    for (const prop of CONFIG.scenery.tavern.frontProps) {
      this.drawTavernProp(prop);
    }

};

Game.prototype.drawTavernWalls = function() {
    const t = CONFIG.tavern;
    const wall = 32;
    ctx.fillStyle = "#24150f";
    ctx.fillRect(t.x - this.camera.x, t.y - wall - this.camera.y, t.width, wall);
    ctx.fillRect(t.x - this.camera.x, t.y + t.height - this.camera.y, t.width, wall);
    ctx.fillRect(t.x - wall - this.camera.x, t.y - this.camera.y, wall, t.height);
    ctx.fillRect(t.x + t.width - this.camera.x, t.y - this.camera.y, wall, CONFIG.door.y - t.y);
    ctx.fillRect(
      t.x + t.width - this.camera.x,
      CONFIG.door.y + CONFIG.door.height - this.camera.y,
      wall,
      t.y + t.height - (CONFIG.door.y + CONFIG.door.height)
    );
    ctx.save();
    ctx.beginPath();
    ctx.rect(t.x - this.camera.x, t.y - wall - this.camera.y, t.width, wall);
    ctx.rect(t.x - this.camera.x, t.y + t.height - this.camera.y, t.width, wall);
    ctx.clip();
    for (let wallX = t.x; wallX < t.x + t.width; wallX += wall) {
      gameSprites.drawTile("wall", wallX - this.camera.x, t.y - 32 - this.camera.y);
      gameSprites.drawTile("wall", wallX - this.camera.x, t.y + t.height - this.camera.y);
    }
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(t.x - wall - this.camera.x, t.y - this.camera.y, wall, t.height);
    ctx.rect(t.x + t.width - this.camera.x, t.y - this.camera.y, wall, CONFIG.door.y - t.y);
    ctx.rect(
      t.x + t.width - this.camera.x,
      CONFIG.door.y + CONFIG.door.height - this.camera.y,
      wall,
      t.y + t.height - (CONFIG.door.y + CONFIG.door.height)
    );
    ctx.clip();
    for (let wallY = t.y; wallY < t.y + t.height; wallY += wall) {
      gameSprites.drawTile("wallDark", t.x - 32 - this.camera.x, wallY - this.camera.y);
    }
    for (let wallY = t.y; wallY < CONFIG.door.y; wallY += wall) {
      gameSprites.drawTile("wallDark", t.x + t.width - this.camera.x, wallY - this.camera.y);
    }
    for (let wallY = CONFIG.door.y + CONFIG.door.height; wallY < t.y + t.height; wallY += wall) {
      gameSprites.drawTile("wallDark", t.x + t.width - this.camera.x, wallY - this.camera.y);
    }
    ctx.restore();

};

Game.prototype.drawTavernDoor = function() {
    const d = CONFIG.door;
    const sx = d.x - this.camera.x;
    const sy = d.y - this.camera.y;
    ctx.fillStyle = "#24150f";
    ctx.fillRect(sx - 10, sy - 10, d.width + 20, d.height + 20);
    ctx.fillStyle = "rgba(255, 203, 91, 0.14)";
    ctx.fillRect(sx + 10, sy + 70, 24, 72);
    if (!gameSprites.drawImage("tavern_door", sx - 16, sy - 12, 78, 104)) {
      gameSprites.drawTile("door", sx, sy, 48);
    }

};

Game.prototype.drawTavernProp = function(prop) {
    return gameSprites.drawImage(
      prop.image,
      prop.x - this.camera.x,
      prop.y - this.camera.y,
      prop.width,
      prop.height
    );

};

Game.prototype.drawField = function() {
    const f = CONFIG.field;
    if (this.currentStageZone().theme === "castle") {
      this.drawCastleField(f);
      return;
    }

    ctx.fillStyle = "#367a3b";
    ctx.fillRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);
    gameSprites.drawTiledArea("grass", f, this.camera, 32, "grassFlowers");
    ctx.strokeStyle = "rgba(13, 42, 21, 0.45)";
    ctx.lineWidth = 6;
    ctx.strokeRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);
    gameSprites.drawTile("fieldEdge", f.x - 18 - this.camera.x, f.y - 18 - this.camera.y, 54);
    gameSprites.drawTile("fieldEdge", f.x + f.width - 36 - this.camera.x, f.y - 18 - this.camera.y, 54);
    gameSprites.drawTile("fieldEdge", f.x - 18 - this.camera.x, f.y + f.height - 36 - this.camera.y, 54);
    gameSprites.drawTile("fieldEdge", f.x + f.width - 36 - this.camera.x, f.y + f.height - 36 - this.camera.y, 54);

    ctx.fillStyle = "#224925";
    for (let x = f.x + 40; x < f.x + f.width; x += 86) {
      for (let y = f.y + 40; y < f.y + f.height; y += 72) {
        if ((x + y) % 3 === 0) ctx.fillRect(x - this.camera.x, y - this.camera.y, 10, 6);
      }
    }

    ctx.fillStyle = "#8b8b7a";
    for (const rock of CONFIG.scenery.rocks) {
      ctx.fillRect(rock[0] - this.camera.x, rock[1] - this.camera.y, 32, 22);
      ctx.fillStyle = "#b2b09a";
      ctx.fillRect(rock[0] - this.camera.x + 6, rock[1] - this.camera.y + 3, 12, 5);
      ctx.fillStyle = "#8b8b7a";
      gameSprites.drawTile("rock", rock[0] - this.camera.x, rock[1] - this.camera.y - 5);
    }
  
};

Game.prototype.drawCastleField = function(f) {
    ctx.fillStyle = "#555850";
    ctx.fillRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);
    gameSprites.drawTiledImageArea("castle_floor_alt", f, this.camera, 128);

    ctx.fillStyle = "rgba(30, 31, 28, 0.18)";
    for (let x = f.x + 30; x < f.x + f.width; x += 96) {
      for (let y = f.y + 44; y < f.y + f.height; y += 84) {
        if ((x + y) % 4 === 0) ctx.fillRect(x - this.camera.x, y - this.camera.y, 22, 8);
      }
    }

    for (const [x, y] of CONFIG.scenery.castle.crackedTiles) {
      gameSprites.drawImage("castle_floor", x - this.camera.x - 44, y - this.camera.y - 44, 88, 88);
    }

    ctx.strokeStyle = "rgba(20, 20, 18, 0.62)";
    ctx.lineWidth = 8;
    ctx.strokeRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);
    ctx.strokeStyle = "rgba(205, 195, 155, 0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(f.x - this.camera.x + 8, f.y - this.camera.y + 8, f.width - 16, f.height - 16);

};

Game.prototype.drawScenery = function() {
    if (this.currentStageZone().theme === "castle") {
      this.drawCastleScenery();
      return;
    }

    const trees = CONFIG.scenery.trees;
    for (const [x, y] of trees) {
      if (!gameSprites.drawImage("tree", x - this.camera.x - 10, y - this.camera.y - 14, 86, 86)) {
        gameSprites.drawTile("tree", x - this.camera.x, y - this.camera.y, 64);
      }
    }

    const bushes = [[840, 365], [1130, 230], [1295, 610], [1605, 505], [1745, 675]];
    for (const [x, y] of bushes) {
      if (!gameSprites.drawImage("bush", x - this.camera.x, y - this.camera.y, 52, 52)) {
        gameSprites.drawTile("bush", x - this.camera.x, y - this.camera.y, 44);
      }
    }

    ctx.fillStyle = "rgba(255, 203, 91, 0.16)";
    ctx.fillRect(CONFIG.door.x - this.camera.x + 12, CONFIG.door.y - this.camera.y + 78, 24, 76);
  
};

Game.prototype.drawCastleScenery = function() {
    const scenery = CONFIG.scenery.castle;

    for (const [x, y] of scenery.deadTrees) {
      gameSprites.drawImage("castle_dead_tree", x - this.camera.x - 44, y - this.camera.y - 86, 88, 100);
    }

    for (const [x, y] of scenery.walls) {
      gameSprites.drawImage("castle_broken_wall", x - this.camera.x - 64, y - this.camera.y - 70, 128, 103);
    }

    for (const [x, y] of scenery.pillars) {
      gameSprites.drawImage("castle_pillar", x - this.camera.x - 30, y - this.camera.y - 88, 60, 99);
    }

    ctx.fillStyle = "rgba(255, 203, 91, 0.12)";
    ctx.fillRect(CONFIG.door.x - this.camera.x + 12, CONFIG.door.y - this.camera.y + 78, 24, 76);

};

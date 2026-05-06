class Game {
  constructor() {
    this.audio = new AudioManager();
    this.player = new Player();
    this.shopkeeper = new Shopkeeper();
    this.shop = new Shop(this);
    this.ui = new UI(this);
    this.camera = { x: 0, y: 0 };
    this.lastTime = 0;
    this.started = false;
    this.selectedClass = null;
    this.restart();
    requestAnimationFrame((time) => this.loop(time));
  }

  restart(showStart = true, classId = null) {
    this.player.start(showStart ? "warrior" : (classId || this.selectedClass || "warrior"));
    this.monsters = [];
    this.loot = [];
    this.coins = [];
    this.itemDrops = [];
    this.powerups = [];
    this.chests = [];
    this.projectiles = [];
    this.floaters = [];
    this.attackEffects = [];
    this.spawnTimer = 1;
    this.spawnInterval = 2.7;
    this.chestTimer = this.randomRange(CONFIG.chests.minDelay, CONFIG.chests.maxDelay);
    this.powerupTimer = this.randomRange(CONFIG.powerups.minDelay, CONFIG.powerups.maxDelay);
    this.bossTimer = this.randomRange(CONFIG.bosses.minDelay, CONFIG.bosses.maxDelay);
    this.day = 1;
    this.questProgress = { kills: 0, loot: 0, gold: 0 };
    this.questNotice = "";
    this.questNoticeTime = 0;
    this.dangerLevel = 1;
    this.maxDangerUnlocked = 1;
    this.dangerProgress = 0;
    this.kills = 0;
    this.totalGoldEarned = 0;
    this.selectedClass = showStart ? null : (classId || this.selectedClass || "warrior");
    this.started = !showStart;
    this.paused = showStart;
    this.shopOpen = false;
    this.shop.backpackUpgradeLevel = 0;
    this.inventoryOpen = false;
    this.gameOver = false;
    this.ui.inventoryOpen = false;
    this.ui.update();
    this.ui.renderShop();
  }

  startGame(classId) {
    if (!CONFIG.classes[classId]) return;
    this.restart(false, classId);
  }

  toggleMusic() {
    this.audio.unlock();
    this.audio.toggleMusic();
    this.ui.updateMusicButtons();
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000 || 0, 0.05);
    this.lastTime = time;
    if (this.started && !this.paused && !this.gameOver) {
      this.update(dt);
    }
    this.draw();
    this.ui.update();
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  update(dt) {
    this.updateCamera();
    mouse.worldX = mouse.x + this.camera.x;
    mouse.worldY = mouse.y + this.camera.y;

    this.player.update(dt, this);
    if (mouse.down) this.player.attack(this);
    for (const monster of this.monsters) monster.update(dt, this);
    for (const projectile of this.projectiles) projectile.update(dt, this);
    this.projectiles = this.projectiles.filter((projectile) => !projectile.dead);
    for (const item of this.loot) item.update(dt);
    for (const coin of this.coins) coin.update(dt);
    for (const itemDrop of this.itemDrops) itemDrop.update(dt);
    for (const powerup of this.powerups) powerup.update(dt);
    this.powerups = this.powerups.filter((powerup) => !powerup.expired);
    for (const chest of this.chests) chest.update(dt);
    for (const floater of this.floaters) floater.update(dt);
    this.floaters = this.floaters.filter((floater) => floater.life > 0);

    for (const effect of this.attackEffects) effect.life -= dt;
    this.attackEffects = this.attackEffects.filter((effect) => effect.life > 0);

    if (!this.playerInTavern()) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnMonsterWave();
        this.spawnTimer = Math.max(0.65, this.spawnInterval - this.dangerLevel * 0.16);
      }
      this.chestTimer -= dt;
      if (this.chestTimer <= 0) {
        this.spawnChest();
        this.chestTimer = this.randomRange(CONFIG.chests.minDelay, CONFIG.chests.maxDelay);
      }
      this.powerupTimer -= dt;
      if (this.powerupTimer <= 0) {
        this.spawnPowerup();
        this.powerupTimer = this.randomRange(CONFIG.powerups.minDelay, CONFIG.powerups.maxDelay);
      }
      this.bossTimer -= dt;
      if (this.bossTimer <= 0) {
        this.spawnBoss();
        this.bossTimer = this.randomRange(CONFIG.bosses.minDelay, CONFIG.bosses.maxDelay);
      }
    }

    if (this.questComplete() && this.playerInTavern()) {
      this.advanceDay();
    }
    this.questNoticeTime = Math.max(0, this.questNoticeTime - dt);
    this.recalculateDanger();
    if (this.player.health <= 0) {
      this.gameOver = true;
      this.paused = false;
      this.shopOpen = false;
      this.audio.play("gameOver");
      this.ui.showGameOver();
    }
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  dangerProgressGoal() {
    return CONFIG.dangerProgress.baseGoal + (this.maxDangerUnlocked - 1) * CONFIG.dangerProgress.perLevel;
  }

  canEarnDangerProgress() {
    return this.dangerLevel === this.maxDangerUnlocked;
  }

  addDangerProgress(amount, label = "stage progress") {
    if (!this.canEarnDangerProgress() || amount <= 0) return;
    this.dangerProgress += amount;
    let unlocked = false;
    while (this.dangerProgress >= this.dangerProgressGoal()) {
      this.dangerProgress -= this.dangerProgressGoal();
      this.maxDangerUnlocked += 1;
      this.dangerLevel = this.maxDangerUnlocked;
      unlocked = true;
    }
    if (unlocked) {
      this.questNotice = `Stage ${this.maxDangerUnlocked} unlocked.`;
      this.questNoticeTime = 3;
      this.audio.play("day");
    } else if (label) {
      this.questNotice = `+${amount} ${label}.`;
      this.questNoticeTime = 1.5;
    }
  }

  setDangerLevel(level) {
    this.dangerLevel = clamp(level, 1, this.maxDangerUnlocked);
    this.spawnTimer = Math.min(this.spawnTimer, Math.max(0.65, this.spawnInterval - this.dangerLevel * 0.16));
    this.ui.renderShop();
  }

  openShop() {
    if (!this.shopkeeper.nearby(this.player) || !this.playerInTavern()) return;
    this.closeInventory();
    this.shopOpen = true;
    this.paused = true;
    this.ui.renderShop();
  }

  interact() {
    if (!this.started) return;
    if (this.shopOpen) return;
    const chest = this.nearbyChest();
    if (chest) {
      chest.open(this);
      this.chests = this.chests.filter((candidate) => candidate !== chest);
      return;
    }
    this.openShop();
  }

  nearbyChest() {
    return this.chests.find((chest) => chest.nearby(this.player));
  }

  closeShop() {
    this.shopOpen = false;
    this.paused = false;
  }

  toggleInventory() {
    if (!this.started || this.gameOver || this.shopOpen) return;
    this.inventoryOpen = !this.inventoryOpen;
    this.paused = this.inventoryOpen;
    if (this.inventoryOpen) {
      this.ui.openInventory();
    } else {
      this.ui.closeInventory();
    }
  }

  closeInventory() {
    this.inventoryOpen = false;
    this.ui.closeInventory();
    if (!this.shopOpen) this.paused = false;
  }

  togglePause() {
    if (!this.started) return;
    if (this.inventoryOpen) {
      this.closeInventory();
      return;
    }
    if (this.shopOpen) {
      this.closeShop();
      return;
    }
    if (!this.gameOver) this.paused = !this.paused;
  }

  spawnMonsterWave() {
    const maxMonsters = 5 + this.dangerLevel * 2;
    if (this.monsters.length >= maxMonsters) return;
    const count = this.dangerLevel >= 5 && Math.random() < 0.45 ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      const roll = Math.random();
      const type = roll < 0.52 ? "slime" : roll < 0.78 ? "goblin" : "wolf";
      const point = this.randomFieldPoint(CONFIG.monsters[type].size, CONFIG.spawns.monsterMinPlayerDistance);
      const x = point.x;
      const y = point.y;
      this.monsters.push(new Monster(type, x, y, this.dangerLevel, false, this.rollMonsterVariant(type)));
    }
  }

  eliteVariantChance() {
    if (this.dangerLevel < CONFIG.monsterVariants.eliteStartStage) return 0;
    if (this.dangerLevel < 12) return 0.25;
    if (this.dangerLevel < 15) return 0.5;
    if (this.dangerLevel < 18) return 0.8;
    return 1;
  }

  rollMonsterVariant(type, forceAtHighStage = false) {
    const variant = CONFIG.monsterVariants.types[type];
    if (!variant) return null;
    if (forceAtHighStage && this.dangerLevel >= CONFIG.monsterVariants.eliteStartStage) return variant.id;
    return Math.random() < this.eliteVariantChance() ? variant.id : null;
  }

  randomFieldPoint(size = 32, minPlayerDistance = 0) {
    let x = CONFIG.field.x + 60 + Math.random() * (CONFIG.field.width - 120);
    let y = CONFIG.field.y + 60 + Math.random() * (CONFIG.field.height - 120);
    const probe = { x, y, size };
    for (let attempt = 0; attempt < 32 && (this.collides(probe, x, y) || this.tooCloseToPlayer(x, y, minPlayerDistance)); attempt += 1) {
      x = CONFIG.field.x + 60 + Math.random() * (CONFIG.field.width - 120);
      y = CONFIG.field.y + 60 + Math.random() * (CONFIG.field.height - 120);
      probe.x = x;
      probe.y = y;
    }
    return { x, y };
  }

  tooCloseToPlayer(x, y, minDistance) {
    return minDistance > 0 && Math.hypot(this.player.x - x, this.player.y - y) < minDistance;
  }

  spawnChest() {
    if (this.chests.length >= CONFIG.chests.maxActive) return;
    const point = this.randomFieldPoint(34);
    this.chests.push(new TreasureChest(point.x, point.y, this.dangerLevel));
    this.floaters.push(new FloatingText("Chest appeared", point.x, point.y - 30, "#ffe18a"));
  }

  spawnPowerup(type = null) {
    if (this.powerups.length >= CONFIG.powerups.maxActive) return;
    const point = this.randomFieldPoint(24);
    const selectedType = type || this.randomPowerupType();
    this.powerups.push(new PowerUp(selectedType, point.x, point.y));
  }

  randomPowerupType() {
    const damaged = this.player.health < this.player.maxHealth * 0.65;
    const table = damaged
      ? ["heart", "heart", "rage", "haste", "shield", "cleave"]
      : ["rage", "haste", "shield", "cleave", "heart"];
    return table[Math.floor(Math.random() * table.length)];
  }

  spawnBoss() {
    if (this.monsters.filter((monster) => monster.isBoss).length >= CONFIG.bosses.maxActive) return;
    const types = Object.keys(CONFIG.bosses.types);
    const type = types[Math.floor(Math.random() * types.length)];
    const point = this.randomFieldPoint(CONFIG.bosses.types[type].size, CONFIG.spawns.bossMinPlayerDistance);
    const boss = new Monster(type, point.x, point.y, this.dangerLevel, true, this.rollMonsterVariant(type, true));
    this.monsters.push(boss);
    this.floaters.push(new FloatingText(`${boss.name} appears!`, boss.x, boss.y - 44, "#ffcf6b"));
    this.audio.play("day");
  }

  killMonster(monster) {
    this.monsters = this.monsters.filter((candidate) => candidate !== monster);
    this.kills += CONFIG.monsters[monster.type].score * (monster.isBoss ? 5 : 1);
    this.questProgress.kills += monster.isBoss ? 3 : 1;
    if (this.player.momentumDuration > 0) {
      this.player.momentumLeft = this.player.momentumDuration;
    }
    this.addDangerProgress(monster.isBoss ? CONFIG.dangerProgress.bossKill : CONFIG.dangerProgress.normalKill, "stage progress");
    this.dropMonsterGold(monster);
    this.tryDropGeneratedItem(monster.isBoss ? "boss" : "monster", monster.x, monster.y - 12, monster);
    if (monster.isBoss) {
      this.floaters.push(new FloatingText("Boss defeated!", monster.x, monster.y - 42, "#ffe18a"));
    }
  }

  tryDropGeneratedItem(source, x, y, context = {}) {
    if (!ItemSystem.rollItemDropChance(source, { ...context, itemFind: this.player.itemFind })) return null;
    const item = ItemSystem.generateItem({
      classRestriction: this.player.classId,
      stage: this.dangerLevel
    });
    this.itemDrops.push(new ItemDrop(item, x + Math.random() * 34 - 17, y + Math.random() * 28 - 14));
    return item;
  }

  dropMonsterGold(monster) {
    const baseGold = CONFIG.monsters[monster.type].gold || 1;
    const stageBonus = Math.floor((this.dangerLevel - 1) * 0.45);
    const variantBonus = monster.variantData ? Math.ceil(baseGold * 0.45) : 0;
    const bossMultiplier = monster.isBoss ? 6 : 1;
    const bossBonus = monster.isBoss ? Math.min(20, this.dangerLevel * 2) : 0;
    const totalGold = Math.max(1, Math.round(((baseGold + stageBonus + variantBonus) * bossMultiplier + bossBonus) * (1 + this.player.goldFind)));
    this.dropCoins(totalGold, monster.x, monster.y);
  }

  dropCoins(totalGold, x, y) {
    const coinOrder = [
      ["gold", CONFIG.coins.gold.value],
      ["silver", CONFIG.coins.silver.value],
      ["bronze", CONFIG.coins.bronze.value]
    ];
    let remaining = totalGold;
    for (const [type, value] of coinOrder) {
      while (remaining >= value) {
        this.coins.push(new CoinDrop(type, x + Math.random() * 42 - 21, y + Math.random() * 34 - 17));
        remaining -= value;
      }
    }
  }

  dropLoot(name, x, y) {
    this.loot.push(new LootItem(name, x, y));
  }

  collectNearbyLoot() {
    for (const item of [...this.loot]) {
      if (distance(this.player, item) < this.player.pickupRange) {
        this.player.addLoot(item.name);
        this.questProgress.loot += 1;
        this.audio.play("loot");
        this.loot = this.loot.filter((candidate) => candidate !== item);
        this.floaters.push(new FloatingText(item.name, this.player.x, this.player.y - 30, "#ffe18a"));
      }
    }
  }

  collectNearbyCoins() {
    for (const coin of [...this.coins]) {
      if (distance(this.player, coin) < this.player.pickupRange) {
        this.player.gold += coin.value;
        this.totalGoldEarned += coin.value;
        this.audio.play("loot");
        this.coins = this.coins.filter((candidate) => candidate !== coin);
        this.floaters.push(new FloatingText(`+${coin.value} gold`, this.player.x, this.player.y - 30, "#ffe18a"));
      }
    }
  }

  collectNearbyItemDrops() {
    for (const itemDrop of [...this.itemDrops]) {
      if (distance(this.player, itemDrop) < this.player.pickupRange + 4) {
        if (!this.player.addItem(itemDrop.item)) {
          if (itemDrop.noticeCooldown <= 0) {
            this.floaters.push(new FloatingText("Inventory full", this.player.x, this.player.y - 36, "#ffb36b"));
            itemDrop.noticeCooldown = 1.1;
          }
          continue;
        }
        this.questProgress.loot += 1;
        this.audio.play("loot");
        this.itemDrops = this.itemDrops.filter((candidate) => candidate !== itemDrop);
        this.floaters.push(new FloatingText(itemDrop.item.name, this.player.x, this.player.y - 34, itemDrop.color));
        if (this.inventoryOpen) this.ui.renderInventory();
      }
    }
  }

  collectNearbyPowerups() {
    for (const powerup of [...this.powerups]) {
      if (distance(this.player, powerup) < this.player.pickupRange + 4) {
        powerup.collect(this);
        this.powerups = this.powerups.filter((candidate) => candidate !== powerup);
      }
    }
  }

  recalculateDanger() {
    this.dangerLevel = clamp(this.dangerLevel, 1, this.maxDangerUnlocked);
  }

  currentQuest() {
    return CONFIG.quests[(this.day - 1) % CONFIG.quests.length];
  }

  questComplete() {
    const quest = this.currentQuest();
    return (!quest.kills || this.questProgress.kills >= quest.kills)
      && (!quest.loot || this.questProgress.loot >= quest.loot)
      && (!quest.gold || this.questProgress.gold >= quest.gold);
  }

  questSummary() {
    const quest = this.currentQuest();
    if (this.questNoticeTime > 0) return this.questNotice;
    if (this.questComplete()) return `Quest complete: return to the tavern for ${quest.reward} bonus gold.`;
    const parts = [];
    if (quest.kills) parts.push(`${this.questProgress.kills}/${quest.kills} hunts`);
    if (quest.loot) parts.push(`${this.questProgress.loot}/${quest.loot} loot`);
    if (quest.gold) parts.push(`${this.questProgress.gold}/${quest.gold} sale gold`);
    return `Quest: ${quest.goal} (${parts.join(", ")})`;
  }

  advanceDay() {
    const quest = this.currentQuest();
    this.player.gold += quest.reward;
    this.totalGoldEarned += quest.reward;
    this.day += 1;
    this.questProgress = { kills: 0, loot: 0, gold: 0 };
    this.questNotice = `Day ${this.day - 1} complete: +${quest.reward} bonus gold. Day ${this.day} begins.`;
    this.questNoticeTime = 4;
    this.player.health = Math.min(this.player.maxHealth, this.player.health + 35);
    this.monsters = this.monsters.filter((monster) => distance(monster, this.player) > 420);
    this.audio.play("day");
    this.addDangerProgress(CONFIG.dangerProgress.questComplete, "stage progress");
  }

  draw() {
    this.updateCamera();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWorld();
    for (const item of this.loot) item.draw(this.camera);
    for (const coin of this.coins) coin.draw(this.camera);
    for (const itemDrop of this.itemDrops) itemDrop.draw(this.camera);
    for (const powerup of this.powerups) powerup.draw(this.camera);
    const promptedChest = this.nearbyChest();
    for (const chest of this.chests) chest.draw(this.camera, chest === promptedChest);
    for (const projectile of this.projectiles) projectile.draw(this.camera);
    for (const monster of this.monsters) monster.draw(this.camera);
    this.shopkeeper.draw(this.camera);
    this.player.draw(this.camera);
    this.drawAttackEffects();
    for (const floater of this.floaters) floater.draw(this.camera);
  }

  drawAttackEffects() {
    for (const effect of this.attackEffects) {
      const alpha = effect.life / effect.maxLife;
      ctx.globalAlpha = alpha;
      const px = (effect.type === "impact" || effect.type === "ranged" ? effect.x : this.player.x) - this.camera.x;
      const py = (effect.type === "impact" || effect.type === "ranged" ? effect.y : this.player.y) - this.camera.y;
      const angle = Math.atan2(effect.dir.y, effect.dir.x);
      ctx.fillStyle = effect.type === "impact" ? "rgba(255, 246, 186, 0.7)" : "rgba(255, 230, 161, 0.58)";
      ctx.strokeStyle = effect.type === "impact" ? "#f5d279" : "#fff1a8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (effect.type === "impact") {
        ctx.arc(px, py, effect.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === "ranged") {
        ctx.moveTo(px - effect.dir.x * 8, py - effect.dir.y * 8);
        ctx.lineTo(px + effect.dir.x * effect.radius, py + effect.dir.y * effect.radius);
        ctx.stroke();
      } else {
        ctx.moveTo(px, py);
        ctx.arc(px, py, effect.radius, angle - 0.72, angle + 0.72);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }
}

class Player {
  constructor() {
    this.start();
  }

  start(classId = "warrior") {
    const classStats = CONFIG.classes[classId] || CONFIG.classes.warrior;
    this.classId = classId;
    this.className = classStats.name;
    this.attackType = classStats.attackType;
    this.spriteName = classStats.sprite;
    this.x = CONFIG.player.x;
    this.y = CONFIG.player.y;
    this.size = CONFIG.player.size;
    this.speed = classStats.speed;
    this.maxHealth = classStats.maxHealth;
    this.health = this.maxHealth;
    this.baseDamage = classStats.damage;
    this.bonusDamage = 0;
    this.attackCooldown = classStats.cooldown;
    this.arrowSpeed = classStats.arrowSpeed || 0;
    this.arrowRange = classStats.arrowRange || 0;
    this.arrowPierce = classStats.arrowPierce || 0;
    this.extraSwings = 0;
    this.extraArrows = 0;
    this.bossDamageBonus = 0;
    this.longRangeBonus = 0;
    this.momentumReduction = 0;
    this.momentumDuration = 0;
    this.momentumLeft = 0;
    this.cooldownLeft = 0;
    this.invulnerableLeft = 0;
    this.facing = { x: 1, y: 0 };
    this.walkFrame = 0;
    this.gold = 0;
    this.inventory = {};
    this.upgrades = new Set();
    this.upgradeLevels = {};
    this.masteryLevels = {};
    this.buffs = {};
    for (const chain of Object.keys(CONFIG.upgradeChains[classId] || CONFIG.upgradeChains.warrior)) {
      this.upgradeLevels[chain] = 0;
    }
    for (const chain of Object.keys(CONFIG.masteryChains[classId] || CONFIG.masteryChains.warrior)) {
      this.masteryLevels[chain] = 0;
    }
  }

  get damage() {
    const base = this.baseDamage + this.bonusDamage;
    return Math.round(base * (this.hasBuff("rage") ? CONFIG.powerups.types.rage.damageMultiplier : 1));
  }

  get effectiveAttackCooldown() {
    return Math.max(0.16, this.attackCooldown - (this.momentumLeft > 0 ? this.momentumReduction : 0));
  }

  update(dt, game) {
    let dx = 0;
    let dy = 0;
    if (keys.has("w") || keys.has("arrowup")) dy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dy += 1;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;

    if (dx || dy) {
      const move = normalize(dx, dy);
      const moveSpeed = this.speed * (this.hasBuff("haste") ? CONFIG.powerups.types.haste.speedMultiplier : 1);
      this.facing = move;
      game.moveEntity(this, move.x * moveSpeed * dt, move.y * moveSpeed * dt);
      this.walkFrame += dt * 9;
    }

    const toMouse = normalize(mouse.worldX - this.x, mouse.worldY - this.y);
    if (Number.isFinite(toMouse.x) && Math.hypot(mouse.worldX - this.x, mouse.worldY - this.y) > 12) {
      this.facing = toMouse;
    }

    this.x = clamp(this.x, this.size / 2, CONFIG.world.width - this.size / 2);
    this.y = clamp(this.y, this.size / 2, CONFIG.world.height - this.size / 2);
    this.cooldownLeft = Math.max(0, this.cooldownLeft - dt);
    this.momentumLeft = Math.max(0, this.momentumLeft - dt);
    this.invulnerableLeft = Math.max(0, this.invulnerableLeft - dt);
    this.updateBuffs(dt);

    game.collectNearbyLoot();
    game.collectNearbyPowerups();
  }

  canAttack() {
    return this.cooldownLeft <= 0;
  }

  attack(game) {
    if (!this.canAttack() || !game.started || game.paused || game.gameOver) return;
    this.cooldownLeft = this.effectiveAttackCooldown;
    game.audio.play("attack");
    if (this.attackType === "ranged") {
      const totalArrows = 1 + this.extraArrows + (this.hasBuff("cleave") ? 3 : 0);
      const spread = totalArrows === 1 ? 0 : Math.min(0.5, 0.16 * (totalArrows - 1));
      for (let i = 0; i < totalArrows; i += 1) {
        const t = totalArrows === 1 ? 0 : i / (totalArrows - 1) - 0.5;
        const dir = rotateVector(this.facing, t * spread);
        game.projectiles.push(new Projectile(
          this.x + dir.x * 20,
          this.y + dir.y * 20,
          dir,
          this.damage,
          this.arrowSpeed,
          this.arrowRange,
          this.arrowPierce + (this.hasBuff("cleave") ? 2 : 0),
          this.longRangeBonus
        ));
      }
      game.attackEffects.push({
        x: this.x + this.facing.x * 24,
        y: this.y + this.facing.y * 24,
        dir: { ...this.facing },
        life: 0.1,
        maxLife: 0.1,
        radius: 26,
        type: "ranged"
      });
      return;
    }

    const swingDirs = this.swingDirections();
    const cleaveBoost = this.hasBuff("cleave");
    const swingRadius = cleaveBoost ? 116 : 58;
    const swingDot = cleaveBoost ? -0.05 : 0.35;
    for (const dir of swingDirs) {
      game.attackEffects.push({
        x: this.x + dir.x * 34,
        y: this.y + dir.y * 34,
        dir: { ...dir },
        life: 0.14,
        maxLife: 0.14,
        radius: swingRadius
      });
    }

    for (const monster of game.monsters) {
      for (const dir of swingDirs) {
        const toMonster = normalize(monster.x - this.x, monster.y - this.y);
        const angleDot = dir.x * toMonster.x + dir.y * toMonster.y;
        const inArc = angleDot > swingDot;
        const inReach = distance(this, monster) <= monster.size / 2 + swingRadius;
        if (inArc && inReach) {
          const damage = monster.isBoss ? Math.round(this.damage * (1 + this.bossDamageBonus)) : this.damage;
          monster.takeDamage(damage, dir, game);
          break;
        }
      }
    }
  }

  swingDirections() {
    const anglesByExtra = {
      0: [0],
      1: [-0.55, 0.55],
      2: [-0.75, 0, 0.75],
      3: [-1.15, -0.38, 0.38, 1.15]
    };
    return (anglesByExtra[Math.min(3, this.extraSwings)] || [0]).map((angle) => rotateVector(this.facing, angle));
  }

  takeDamage(amount) {
    if (this.invulnerableLeft > 0 || this.hasBuff("shield")) return;
    this.health -= amount;
    this.invulnerableLeft = CONFIG.player.invulnerableTime;
  }

  addBuff(type, duration) {
    this.buffs[type] = Math.max(this.buffs[type] || 0, duration);
  }

  hasBuff(type) {
    return (this.buffs[type] || 0) > 0;
  }

  updateBuffs(dt) {
    for (const type of Object.keys(this.buffs)) {
      this.buffs[type] -= dt;
      if (this.buffs[type] <= 0) delete this.buffs[type];
    }
  }

  addLoot(name) {
    this.inventory[name] = (this.inventory[name] || 0) + 1;
  }

  draw(camera) {
    gameSprites.drawPlayer(this, camera);
  }
}


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
    this.baseSpeed = classStats.speed;
    this.baseMaxHealth = classStats.maxHealth;
    this.health = this.baseMaxHealth;
    this.baseDamage = classStats.damage;
    this.baseBonusDamage = 0;
    this.attackCooldown = classStats.cooldown;
    this.baseArrowSpeed = classStats.arrowSpeed || 0;
    this.baseArrowRange = classStats.arrowRange || 0;
    this.baseArrowPierce = classStats.arrowPierce || 0;
    this.extraSwings = 0;
    this.extraArrows = 0;
    this.baseBossDamageBonus = 0;
    this.baseLongRangeBonus = 0;
    this.momentumReduction = 0;
    this.momentumDuration = 0;
    this.momentumLeft = 0;
    this.cooldownLeft = 0;
    this.invulnerableLeft = 0;
    this.facing = { x: 1, y: 0 };
    this.walkFrame = 0;
    this.gold = 0;
    this.inventory = {};
    this.items = [];
    this.equipment = Object.fromEntries(ITEM_SLOT_ORDER.map((slot) => [slot, null]));
    this.itemStats = {};
    this.buffs = {};
  }

  get damage() {
    const base = this.baseDamage + this.bonusDamage + (this.itemStats.damage || 0);
    return Math.round(base * (this.hasBuff("rage") ? CONFIG.powerups.types.rage.damageMultiplier : 1));
  }

  get speed() {
    return this.baseSpeed + (this.itemStats.speed || 0);
  }

  set speed(value) {
    this.baseSpeed = value - (this.itemStats.speed || 0);
  }

  get maxHealth() {
    return this.baseMaxHealth + (this.itemStats.maxHealth || 0);
  }

  set maxHealth(value) {
    this.baseMaxHealth = value - (this.itemStats.maxHealth || 0);
  }

  get bonusDamage() {
    return this.baseBonusDamage + (this.itemStats.bonusDamage || 0);
  }

  set bonusDamage(value) {
    this.baseBonusDamage = value - (this.itemStats.bonusDamage || 0);
  }

  get arrowSpeed() {
    return this.baseArrowSpeed + (this.itemStats.arrowSpeed || 0);
  }

  set arrowSpeed(value) {
    this.baseArrowSpeed = value - (this.itemStats.arrowSpeed || 0);
  }

  get arrowRange() {
    return this.baseArrowRange + (this.itemStats.arrowRange || 0);
  }

  set arrowRange(value) {
    this.baseArrowRange = value - (this.itemStats.arrowRange || 0);
  }

  get arrowPierce() {
    return this.baseArrowPierce + (this.itemStats.arrowPierce || 0);
  }

  set arrowPierce(value) {
    this.baseArrowPierce = value - (this.itemStats.arrowPierce || 0);
  }

  get bossDamageBonus() {
    return this.baseBossDamageBonus + (this.itemStats.bossDamageBonus || 0);
  }

  set bossDamageBonus(value) {
    this.baseBossDamageBonus = value - (this.itemStats.bossDamageBonus || 0);
  }

  get longRangeBonus() {
    return this.baseLongRangeBonus + (this.itemStats.longRangeBonus || 0);
  }

  set longRangeBonus(value) {
    this.baseLongRangeBonus = value - (this.itemStats.longRangeBonus || 0);
  }

  get effectiveAttackCooldown() {
    const itemCooldownReduction = this.itemStats.attackCooldown || 0;
    return Math.max(0.16, this.attackCooldown - itemCooldownReduction - (this.momentumLeft > 0 ? this.momentumReduction : 0));
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
    game.collectNearbyCoins();
    game.collectNearbyItemDrops();
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
    this.health -= Math.max(1, Math.round(amount * (1 - (this.itemStats.damageReduction || 0))));
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

  addItem(item) {
    this.items.push(item);
  }

  removeItem(uniqueId) {
    this.items = this.items.filter((item) => item.uniqueId !== uniqueId);
  }

  isItemEquipped(uniqueId) {
    return Object.values(this.equipment).some((item) => item && item.uniqueId === uniqueId);
  }

  canEquipItem(item) {
    return item && item.classRestriction === this.classId && ITEM_SLOT_ORDER.includes(item.slot);
  }

  equipItem(uniqueId) {
    const item = this.items.find((candidate) => candidate.uniqueId === uniqueId);
    if (!this.canEquipItem(item)) return false;
    this.equipment[item.slot] = item;
    this.recalculateItemStats();
    this.health = Math.min(this.health, this.maxHealth);
    return true;
  }

  unequipSlot(slot) {
    if (!this.equipment[slot]) return false;
    this.equipment[slot] = null;
    this.recalculateItemStats();
    this.health = Math.min(this.health, this.maxHealth);
    return true;
  }

  recalculateItemStats() {
    const stats = {};
    for (const item of Object.values(this.equipment)) {
      if (!item) continue;
      for (const [stat, value] of Object.entries(item.stats)) {
        stats[stat] = (stats[stat] || 0) + value;
      }
    }
    this.itemStats = stats;
  }

  getEquippedStats() {
    return { ...this.itemStats };
  }

  draw(camera) {
    gameSprites.drawPlayer(this, camera);
  }
}


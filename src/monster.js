class Monster {
  constructor(type, x, y, dangerLevel, isBoss = false, variantId = null) {
    const stats = CONFIG.monsters[type];
    const bossStats = isBoss ? CONFIG.bosses.types[type] : null;
    const variantStats = variantId ? CONFIG.monsterVariants.types[type] : null;
    this.type = type;
    this.variantId = variantStats ? variantStats.id : null;
    this.variantData = variantStats;
    this.spriteName = variantStats ? variantStats.sprite : type;
    this.isBoss = isBoss;
    this.name = bossStats ? (variantStats ? variantStats.bossTitle : bossStats.title) : (variantStats ? variantStats.name : stats.name);
    this.x = x;
    this.y = y;
    this.size = bossStats ? bossStats.size : stats.size;
    const zoneStats = monsterZoneStats(dangerLevel);
    this.speed = stats.speed * (bossStats ? bossStats.speed : 1) * (variantStats ? variantStats.speed : 1);
    this.maxHealth = Math.round(stats.health * zoneStats.health * (bossStats ? bossStats.health : 1) * (variantStats ? variantStats.health : 1));
    this.health = this.maxHealth;
    this.damage = Math.round(stats.damage * zoneStats.damage * (bossStats ? bossStats.damage : 1) * (variantStats ? variantStats.damage : 1));
    this.attackCooldown = stats.attackCooldown * (isBoss ? 1.12 : 1) * (variantStats ? variantStats.attackCooldown : 1);
    this.attackLeft = Math.random() * 0.4;
    this.color = variantStats ? variantStats.color : stats.color;
    this.bossTint = variantStats ? variantStats.tint : (bossStats ? bossStats.tint : null);
    this.hitFlash = 0;
    this.knockback = { x: 0, y: 0 };
    this.walkFrame = Math.random() * 10;
    this.lastMoveX = 1;
    this.lastMoveY = 0;
  }

  update(dt, game) {
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.attackLeft = Math.max(0, this.attackLeft - dt);

    game.moveEntity(this, this.knockback.x * dt, this.knockback.y * dt, CONFIG.field);
    this.knockback.x *= Math.pow(0.02, dt);
    this.knockback.y *= Math.pow(0.02, dt);
    this.walkFrame += dt * (this.speed / 16);

    const player = game.player;
    const chaseRange = 330;
    const inField = rectContains(CONFIG.field, this.x, this.y);
    if (distance(this, player) < chaseRange && !game.playerInTavern() && inField) {
      const move = normalize(player.x - this.x, player.y - this.y);
      game.moveEntity(this, move.x * this.speed * dt, move.y * this.speed * dt, CONFIG.field);
      this.lastMoveX = move.x;
      this.lastMoveY = move.y;
    }

    this.x = clamp(this.x, CONFIG.field.x + this.size / 2, CONFIG.field.x + CONFIG.field.width - this.size / 2);
    this.y = clamp(this.y, CONFIG.field.y + this.size / 2, CONFIG.field.y + CONFIG.field.height - this.size / 2);

    if (distance(this, player) < (this.size + player.size) / 2 && this.attackLeft <= 0 && !game.playerInTavern()) {
      player.takeDamage(this.damage);
      game.audio.play("hurt");
      game.floaters.push(new FloatingText(`-${this.damage}`, player.x, player.y - 22, "#ff6657"));
      this.attackLeft = this.attackCooldown;
    }
  }

  takeDamage(amount, direction, game) {
    this.health -= amount;
    this.hitFlash = 0.12;
    game.audio.play("hit");
    this.knockback.x += direction.x * 470;
    this.knockback.y += direction.y * 470;
    game.floaters.push(new FloatingText(amount, this.x, this.y - 22, "#fff0a3"));
    if (this.health <= 0) {
      game.killMonster(this);
    }
  }

  draw(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    gameSprites.drawMonster(this, camera);

    const barWidth = this.size + 8;
    ctx.fillStyle = "#2b1717";
    ctx.fillRect(Math.floor(sx - barWidth / 2), Math.floor(sy - this.size / 2 - 10), barWidth, 4);
    ctx.fillStyle = "#dc4a3d";
    ctx.fillRect(Math.floor(sx - barWidth / 2), Math.floor(sy - this.size / 2 - 10), barWidth * (this.health / this.maxHealth), 4);
  }
}

class Warboss extends Monster {
  constructor(x, y) {
    super("goblin", x, y, CONFIG.fieldBoss.gateStage, true, "red");
    const stats = CONFIG.fieldBoss;
    this.type = stats.type;
    this.name = stats.name;
    this.spriteName = "warboss";
    this.isBoss = true;
    this.isFieldBoss = true;
    this.variantId = null;
    this.variantData = null;
    this.size = stats.size;
    this.speed = stats.speed;
    this.maxHealth = stats.health;
    this.health = this.maxHealth;
    this.damage = stats.damage;
    this.chargeDamage = stats.chargeDamage;
    this.attackCooldown = 1.1;
    this.bossTint = "#ffb24f";
    this.state = "chase";
    this.stateTime = 0;
    this.chargeCooldown = 1.4;
    this.chargeDir = { x: 1, y: 0 };
    this.chargeDistanceLeft = 0;
    this.hasHitThisCharge = false;
  }

  update(dt, game) {
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.attackLeft = Math.max(0, this.attackLeft - dt);
    this.chargeCooldown = Math.max(0, this.chargeCooldown - dt);
    this.stateTime += dt;
    this.walkFrame += dt * (this.speed / 16);

    const player = game.player;
    if (this.state === "windup") {
      if (this.stateTime >= CONFIG.fieldBoss.chargeWindup) this.startCharge();
    } else if (this.state === "charge") {
      this.updateCharge(dt, game);
    } else if (this.state === "recover") {
      if (this.stateTime >= CONFIG.fieldBoss.chargeRecover) this.setState("chase");
    } else {
      this.updateChase(dt, game, player);
    }

    this.x = clamp(this.x, CONFIG.field.x + this.size / 2, CONFIG.field.x + CONFIG.field.width - this.size / 2);
    this.y = clamp(this.y, CONFIG.field.y + this.size / 2, CONFIG.field.y + CONFIG.field.height - this.size / 2);
    this.tryContactDamage(player, game, this.state === "charge" ? this.chargeDamage : this.damage);
  }

  updateChase(dt, game, player) {
    if (distance(this, player) <= CONFIG.fieldBoss.chargeRange && this.chargeCooldown <= 0 && !game.playerInTavern()) {
      this.chargeDir = normalize(player.x - this.x, player.y - this.y);
      this.lastMoveX = this.chargeDir.x;
      this.lastMoveY = this.chargeDir.y;
      this.setState("windup");
      game.floaters.push(new FloatingText("Charge!", this.x, this.y - 64, "#ffcf6b"));
      return;
    }

    if (distance(this, player) < 420 && !game.playerInTavern()) {
      const move = normalize(player.x - this.x, player.y - this.y);
      game.moveEntity(this, move.x * this.speed * dt, move.y * this.speed * dt, CONFIG.field);
      this.lastMoveX = move.x;
      this.lastMoveY = move.y;
    }
  }

  startCharge() {
    this.setState("charge");
    this.chargeDistanceLeft = CONFIG.fieldBoss.chargeDistance;
    this.hasHitThisCharge = false;
  }

  updateCharge(dt, game) {
    const step = Math.min(this.chargeDistanceLeft, CONFIG.fieldBoss.chargeSpeed * dt);
    const beforeX = this.x;
    const beforeY = this.y;
    game.moveEntity(this, this.chargeDir.x * step, this.chargeDir.y * step, CONFIG.field);
    this.lastMoveX = this.chargeDir.x;
    this.lastMoveY = this.chargeDir.y;
    this.chargeDistanceLeft -= Math.hypot(this.x - beforeX, this.y - beforeY);
    if (this.chargeDistanceLeft <= 0 || (Math.abs(this.x - beforeX) < 0.5 && Math.abs(this.y - beforeY) < 0.5)) {
      this.chargeCooldown = CONFIG.fieldBoss.chargeCooldown;
      this.setState("recover");
    }
  }

  tryContactDamage(player, game, amount) {
    if (distance(this, player) >= (this.size + player.size) / 2 || this.attackLeft > 0 || game.playerInTavern()) return;
    if (this.state === "charge" && this.hasHitThisCharge) return;
    player.takeDamage(amount);
    game.audio.play("hurt");
    game.floaters.push(new FloatingText(`-${amount}`, player.x, player.y - 22, "#ff6657"));
    this.attackLeft = this.state === "charge" ? 0.4 : this.attackCooldown;
    this.hasHitThisCharge = this.state === "charge";
  }

  setState(state) {
    this.state = state;
    this.stateTime = 0;
  }
}

function monsterZoneStats(stage) {
  let zone = CONFIG.stageZones[0];
  for (const candidate of CONFIG.stageZones) {
    if (stage >= candidate.minStage) zone = candidate;
  }
  return zone.statMultiplier || { health: 1, damage: 1 };
}

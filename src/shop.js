class Shopkeeper {
  constructor() {
    this.x = 558;
    this.y = 270;
    this.size = 30;
  }

  nearby(player) {
    return Math.hypot(player.x - this.x, player.y - this.y) < 78 || this.nearCounter(player);
  }

  nearCounter(player) {
    const counter = CONFIG.scenery.tavern.frontProps.find((prop) => prop.image === "tavern_counter");
    if (!counter) return false;
    const nearestX = clamp(player.x, counter.x, counter.x + counter.width);
    const nearestY = clamp(player.y, counter.y, counter.y + counter.height);
    return Math.hypot(player.x - nearestX, player.y - nearestY) < 54;
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
    this.backpackUpgradeLevel = 0;
  }

  sellItem(uniqueId) {
    const p = this.game.player;
    const item = p.items.find((candidate) => candidate.uniqueId === uniqueId);
    if (!item || p.isItemEquipped(uniqueId)) return;
    p.removeItem(uniqueId);
    p.gold += item.sellValue;
    this.game.totalGoldEarned += item.sellValue;
    this.game.addDangerProgress(Math.max(1, Math.floor(item.sellValue / CONFIG.dangerProgress.saleGoldDivisor)), "stage progress");
    this.game.audio.play("sell");
    this.game.ui.renderShop();
    if (this.game.inventoryOpen) this.game.ui.renderInventory();
  }

  sellAll() {
    for (const item of [...this.game.player.unequippedItems()]) {
      this.sellItem(item.uniqueId);
    }
    this.game.ui.renderShop();
  }

  nextBackpackUpgrade() {
    return CONFIG.shopServices.backpackUpgrades[this.backpackUpgradeLevel] || null;
  }

  buyBackpackUpgrade() {
    const upgrade = this.nextBackpackUpgrade();
    const p = this.game.player;
    if (!upgrade || p.gold < upgrade.price) return false;
    p.gold -= upgrade.price;
    p.inventoryCapacityBonus += upgrade.slots;
    this.backpackUpgradeLevel += 1;
    this.afterPurchase();
    return true;
  }

  healCost() {
    const p = this.game.player;
    const missingHp = Math.max(0, p.maxHealth - Math.ceil(p.health));
    return missingHp <= 0 ? 0 : CONFIG.shopServices.healBasePrice + missingHp * CONFIG.shopServices.healPerMissingHp;
  }

  healToFull() {
    const p = this.game.player;
    const cost = this.healCost();
    if (cost <= 0 || p.gold < cost) return false;
    p.gold -= cost;
    p.health = p.maxHealth;
    this.afterPurchase();
    return true;
  }

  mysteryItemCost() {
    return CONFIG.shopServices.mysteryItemBasePrice + this.game.dangerLevel * CONFIG.shopServices.mysteryItemStagePrice;
  }

  buyMysteryItem() {
    const p = this.game.player;
    const cost = this.mysteryItemCost();
    if (p.gold < cost || !p.hasInventorySpace()) return false;
    p.gold -= cost;
    p.addItem(ItemSystem.generateItem({
      classRestriction: p.classId,
      stage: this.game.dangerLevel
    }));
    this.afterPurchase();
    return true;
  }

  rarityUpgradeCost(item) {
    return CONFIG.shopServices.rarityUpgradePrices[item.rarity] || null;
  }

  upgradeItemRarity(uniqueId) {
    const p = this.game.player;
    const item = p.unequippedItems().find((candidate) => candidate.uniqueId === uniqueId);
    const cost = item ? this.rarityUpgradeCost(item) : null;
    const upgraded = item ? ItemSystem.upgradeItemRarity(item) : null;
    if (!item || !cost || !upgraded || p.gold < cost) return false;
    p.gold -= cost;
    p.removeItem(item.uniqueId);
    p.addItem(upgraded);
    this.afterPurchase();
    return true;
  }

  afterPurchase() {
    this.game.audio.play("buy");
    this.game.ui.renderShop();
    if (this.game.inventoryOpen) this.game.ui.renderInventory();
  }
}


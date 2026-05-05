class UI {
  constructor(game) {
    this.game = game;
    this.healthText = document.getElementById("healthText");
    this.healthBar = document.getElementById("healthBar");
    this.goldText = document.getElementById("goldText");
    this.damageText = document.getElementById("damageText");
    this.dangerText = document.getElementById("dangerText");
    this.dangerBar = document.getElementById("dangerBar");
    this.dayText = document.getElementById("dayText");
    this.questText = document.getElementById("questText");
    this.buffText = document.getElementById("buffText");
    this.inventoryText = document.getElementById("inventoryText");
    this.hintText = document.getElementById("hintText");
    this.hud = document.getElementById("hud");
    this.startOverlay = document.getElementById("startOverlay");
    this.inventoryOverlay = document.getElementById("inventoryOverlay");
    this.shopOverlay = document.getElementById("shopOverlay");
    this.pauseOverlay = document.getElementById("pauseOverlay");
    this.gameOverOverlay = document.getElementById("gameOverOverlay");
    this.gameOverStats = document.getElementById("gameOverStats");
    this.sellList = document.getElementById("sellList");
    this.dangerList = document.getElementById("dangerList");
    this.equipmentSlots = document.getElementById("equipmentSlots");
    this.itemList = document.getElementById("itemList");
    this.itemListTitle = document.getElementById("itemListTitle");
    this.warriorButton = document.getElementById("warriorButton");
    this.rangerButton = document.getElementById("rangerButton");
    this.startRunButton = document.getElementById("startRunButton");
    this.startMusicButton = document.getElementById("startMusicButton");
    this.hudMusicButton = document.getElementById("hudMusicButton");
    this.shopTabs = {
      sell: document.getElementById("shopTabSell"),
      danger: document.getElementById("shopTabDanger")
    };
    this.shopPages = {
      sell: document.getElementById("sellPage"),
      danger: document.getElementById("dangerPage")
    };
    this.activeShopTab = "sell";
    this.selectedClassId = "warrior";
    this.inventoryOpen = false;

    document.getElementById("closeInventoryButton").addEventListener("click", () => game.closeInventory());
    document.getElementById("closeShopButton").addEventListener("click", () => game.closeShop());
    document.getElementById("sellAllButton").addEventListener("click", () => game.shop.sellAll());
    document.getElementById("restartButton").addEventListener("click", () => game.restart());
    this.warriorButton.addEventListener("click", () => this.selectClass("warrior"));
    this.rangerButton.addEventListener("click", () => this.selectClass("ranger"));
    this.startRunButton.addEventListener("click", () => game.startGame(this.selectedClassId));
    this.startMusicButton.addEventListener("click", () => game.toggleMusic());
    this.hudMusicButton.addEventListener("click", () => game.toggleMusic());
    for (const [tab, button] of Object.entries(this.shopTabs)) {
      button.addEventListener("click", () => this.setShopTab(tab));
    }
    this.selectClass("warrior");
  }

  selectClass(classId) {
    this.selectedClassId = classId;
    this.warriorButton.classList.toggle("selected", classId === "warrior");
    this.rangerButton.classList.toggle("selected", classId === "ranger");
    this.startRunButton.textContent = `Start as ${CONFIG.classes[classId].name}`;
  }

  setShopTab(tab) {
    this.activeShopTab = tab;
    for (const [name, button] of Object.entries(this.shopTabs)) {
      button.classList.toggle("active", name === tab);
      this.shopPages[name].classList.toggle("hidden", name !== tab);
    }
  }

  openInventory() {
    this.inventoryOpen = true;
    this.renderInventory();
    this.update();
  }

  closeInventory() {
    this.inventoryOpen = false;
    this.update();
  }

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
    if (this.inventoryOpen) this.renderInventory();
    this.update();
  }

  updateMusicButtons() {
    const label = this.game.audio.musicEnabled ? "Music On" : "Music Off";
    this.startMusicButton.textContent = label;
    this.hudMusicButton.textContent = label;
    this.startMusicButton.classList.toggle("active", this.game.audio.musicEnabled);
    this.hudMusicButton.classList.toggle("active", this.game.audio.musicEnabled);
  }

  update() {
    const p = this.game.player;
    this.healthText.textContent = `HP ${Math.ceil(p.health)}/${p.maxHealth}`;
    this.healthBar.style.width = `${clamp((p.health / p.maxHealth) * 100, 0, 100)}%`;
    this.goldText.textContent = p.gold;
    this.damageText.textContent = p.damage;
    this.dangerText.textContent = this.game.canEarnDangerProgress()
      ? `Stage ${this.game.dangerLevel} ${this.game.dangerProgress}/${this.game.dangerProgressGoal()}`
      : `Stage ${this.game.dangerLevel} / Cap ${this.game.maxDangerUnlocked}`;
    this.dangerBar.style.width = this.game.canEarnDangerProgress()
      ? `${clamp((this.game.dangerProgress / this.game.dangerProgressGoal()) * 100, 0, 100)}%`
      : "0%";
    this.dayText.textContent = this.game.day;
    this.questText.textContent = this.game.questSummary();
    const activeBuffs = Object.entries(p.buffs).filter(([, time]) => time > 0);
    if (activeBuffs.length) {
      this.buffText.innerHTML = activeBuffs.map(([type, time]) => {
        const data = CONFIG.powerups.types[type];
        const index = gameSprites.powerupFrames[type] || 0;
        return `<span class="buff-chip"><span class="powerup-icon" style="background-position:-${index * 20}px 0"></span>${data.shortName} ${Math.ceil(time)}s</span>`;
      }).join("");
    } else {
      this.buffText.textContent = "";
    }

    const equippedCount = Object.values(p.equipment).filter(Boolean).length;
    this.inventoryText.textContent = `Inventory ${p.inventoryCount()}/${CONFIG.inventory.capacity} items | ${equippedCount}/6 equipped | Tab`;

    if (!this.game.started) {
      this.hintText.textContent = "";
    } else if (this.inventoryOpen) {
      this.hintText.textContent = "Tab or Escape to close inventory";
    } else if (this.game.shopkeeper.nearby(p) && this.game.playerInTavern() && !this.game.shopOpen) {
      this.hintText.textContent = "Press E to trade";
    } else if (this.game.nearbyChest() && !this.game.shopOpen) {
      this.hintText.textContent = "Press E to open chest";
    } else if (this.game.gameOver) {
      this.hintText.textContent = "Press R to restart";
    } else {
      this.hintText.textContent = "";
    }

    this.hud.classList.toggle("hidden", !this.game.started);
    this.startOverlay.classList.toggle("hidden", this.game.started);
    this.startOverlay.setAttribute("aria-hidden", String(this.game.started));
    this.inventoryOverlay.classList.toggle("hidden", !this.inventoryOpen);
    this.inventoryOverlay.setAttribute("aria-hidden", String(!this.inventoryOpen));
    this.shopOverlay.classList.toggle("hidden", !this.game.shopOpen);
    this.shopOverlay.setAttribute("aria-hidden", String(!this.game.shopOpen));
    this.pauseOverlay.classList.toggle("hidden", !this.game.paused || this.inventoryOpen || this.game.shopOpen || this.game.gameOver || !this.game.started);
    this.pauseOverlay.setAttribute("aria-hidden", String(!this.game.paused || this.inventoryOpen || this.game.shopOpen || this.game.gameOver || !this.game.started));
    this.gameOverOverlay.classList.toggle("hidden", !this.game.gameOver);
    this.gameOverOverlay.setAttribute("aria-hidden", String(!this.game.gameOver));
    this.updateMusicButtons();
  }

  renderShop() {
    this.setShopTab(this.activeShopTab);
    const p = this.game.player;
    this.sellList.innerHTML = "";
    const sellableItems = p.unequippedItems();
    for (const item of sellableItems) {
      const row = document.createElement("div");
      row.className = `shop-row rarity-${item.rarity}`;
      row.innerHTML = `<div><strong>${item.name}</strong><small>${ITEM_SLOT_LABELS[item.slot]} | Level ${item.itemLevel} | ${this.itemStatsText(item)} | ${item.sellValue} gold</small></div>`;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Sell";
      button.addEventListener("click", () => this.game.shop.sellItem(item.uniqueId));
      row.appendChild(button);
      this.sellList.appendChild(row);
    }
    if (!sellableItems.length) {
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = "<div><strong>No spare equipment to sell</strong><small>Equipped items stay safely in their equipment slots.</small></div>";
      this.sellList.appendChild(row);
    }

    this.dangerList.innerHTML = "";
    const note = document.createElement("div");
    note.className = "danger-note";
    note.textContent = this.game.dangerLevel === this.game.maxDangerUnlocked
      ? `Next unlock: ${this.game.dangerProgress}/${this.game.dangerProgressGoal()} progress.`
      : "Lower stage selected. New stages will not unlock.";
    this.dangerList.appendChild(note);
    for (let level = 1; level <= this.game.maxDangerUnlocked; level += 1) {
      const row = document.createElement("div");
      row.className = "shop-row";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${level}`;
      button.className = level === this.game.dangerLevel ? "active" : "";
      button.title = level === this.game.dangerLevel ? "Current stage" : `Switch to stage ${level}`;
      button.addEventListener("click", () => this.game.setDangerLevel(level));
      row.appendChild(button);
      this.dangerList.appendChild(row);
    }
  }

  renderInventory() {
    const p = this.game.player;
    const backpackItems = p.unequippedItems();
    this.itemListTitle.textContent = `Items ${p.inventoryCount()}/${CONFIG.inventory.capacity}`;
    this.equipmentSlots.innerHTML = "";
    for (const slot of ITEM_SLOT_ORDER) {
      const item = p.equipment[slot];
      const canUnequip = p.canUnequipSlot(slot);
      const row = document.createElement("button");
      row.type = "button";
      row.className = `equipment-slot ${item ? `rarity-${item.rarity}` : ""}`;
      row.disabled = !item || !canUnequip;
      row.innerHTML = item
        ? `<span>${ITEM_SLOT_LABELS[slot]}</span><strong>${item.name}</strong><small>${canUnequip ? this.itemStatsText(item) : "Backpack full"}</small>`
        : `<span>${ITEM_SLOT_LABELS[slot]}</span><strong>Empty</strong><small>No item equipped</small>`;
      row.addEventListener("click", () => {
        p.unequipSlot(slot);
        this.renderInventory();
        this.update();
      });
      this.equipmentSlots.appendChild(row);
    }

    this.itemList.innerHTML = "";
    for (const item of backpackItems) {
      const row = document.createElement("div");
      row.className = `item-row rarity-${item.rarity}`;
      const comparison = this.itemComparisonText(item, p.equipment[item.slot]);
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <small>${ITEM_SLOT_LABELS[item.slot]} | Level ${item.itemLevel} | ${this.itemStatsText(item)} | Sell ${item.sellValue}g</small>
          ${comparison}
        </div>
      `;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Equip";
      button.disabled = !p.canEquipItem(item);
      button.addEventListener("click", () => {
        p.equipItem(item.uniqueId);
        this.renderInventory();
        this.update();
      });
      row.appendChild(button);
      this.itemList.appendChild(row);
    }

    if (!backpackItems.length) {
      const empty = document.createElement("div");
      empty.className = "item-row";
      empty.innerHTML = "<div><strong>No backpack items</strong><small>Equipped gear does not use backpack slots.</small></div>";
      this.itemList.appendChild(empty);
    }
  }

  itemStatsText(item) {
    return Object.entries(item.stats)
      .map(([stat, value]) => `${this.statLabel(stat)} +${this.formatStatValue(value, stat)}`)
      .join(", ");
  }

  itemComparisonText(item, equippedItem) {
    if (equippedItem && equippedItem.uniqueId === item.uniqueId) {
      return `<div class="item-compare neutral">Currently equipped</div>`;
    }
    if (!equippedItem) {
      return `<div class="item-compare positive">No ${ITEM_SLOT_LABELS[item.slot].toLowerCase()} equipped</div>`;
    }
    const statNames = new Set([...Object.keys(item.stats), ...Object.keys(equippedItem.stats)]);
    const parts = [];
    for (const stat of statNames) {
      const diff = (item.stats[stat] || 0) - (equippedItem.stats[stat] || 0);
      if (Math.abs(diff) < 0.001) continue;
      const className = diff > 0 ? "positive" : "negative";
      const sign = diff > 0 ? "+" : "";
      parts.push(`<span class="${className}">${this.statLabel(stat)} ${sign}${this.formatStatValue(diff, stat)}</span>`);
    }
    if (!parts.length) return `<div class="item-compare neutral">Same stats as equipped</div>`;
    return `<div class="item-compare">Vs equipped: ${parts.join(" ")}</div>`;
  }

  formatStatValue(value, stat = "") {
    if (this.isPercentStat(stat)) return `${Math.round(value * 100)}%`;
    return Number.isInteger(value) ? `${value}` : `${Math.round(value * 100) / 100}`;
  }

  isPercentStat(stat) {
    return ["damageReduction", "attackSpeed", "critChance", "critDamage", "bossDamage", "longRangeDamage", "goldFind", "itemFind"].includes(stat);
  }

  statLabel(stat) {
    return {
      damage: "Damage",
      maxHealth: "Max HP",
      damageReduction: "Damage reduction",
      speed: "Speed",
      attackSpeed: "Attack speed",
      critChance: "Crit chance",
      critDamage: "Crit damage",
      arrowSpeed: "Arrow speed",
      arrowRange: "Arrow range",
      arrowPierce: "Arrow pierce",
      bossDamage: "Boss damage",
      longRangeDamage: "Long range damage",
      pickupRange: "Pickup range",
      goldFind: "Gold find",
      itemFind: "Item find"
    }[stat] || stat;
  }

  showGameOver() {
    this.gameOverStats.textContent = `Day: ${this.game.day} | Kills: ${this.game.kills} | Gold earned: ${this.game.totalGoldEarned} | Stage reached: ${this.game.dangerLevel}`;
  }
}


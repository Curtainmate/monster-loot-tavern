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
    this.bossBar = document.getElementById("bossBar");
    this.bossName = document.getElementById("bossName");
    this.bossRole = document.getElementById("bossRole");
    this.bossHealthBar = document.getElementById("bossHealthBar");
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
    this.servicesList = document.getElementById("servicesList");
    this.dangerList = document.getElementById("dangerList");
    this.equipmentSlots = document.getElementById("equipmentSlots");
    this.itemList = document.getElementById("itemList");
    this.itemListTitle = document.getElementById("itemListTitle");
    this.itemListHint = document.getElementById("itemListHint");
    this.inventoryHeroPortrait = document.getElementById("inventoryHeroPortrait");
    this.inventoryStatList = document.getElementById("inventoryStatList");
    this.warriorButton = document.getElementById("warriorButton");
    this.rangerButton = document.getElementById("rangerButton");
    this.startRunButton = document.getElementById("startRunButton");
    this.startMusicButton = document.getElementById("startMusicButton");
    this.hudMusicButton = document.getElementById("hudMusicButton");
    this.cheatStatus = document.getElementById("cheatStatus");
    this.masterVolumeSlider = document.getElementById("masterVolumeSlider");
    this.masterVolumeValue = document.getElementById("masterVolumeValue");
    this.shopTabs = {
      sell: document.getElementById("shopTabSell"),
      services: document.getElementById("shopTabServices"),
      danger: document.getElementById("shopTabDanger")
    };
    this.shopPages = {
      sell: document.getElementById("sellPage"),
      services: document.getElementById("servicesPage"),
      danger: document.getElementById("dangerPage")
    };
    this.activeShopTab = "sell";
    this.selectedClassId = "warrior";
    this.inventoryOpen = false;

    document.getElementById("closeInventoryButton").addEventListener("click", () => game.closeInventory());
    document.getElementById("closeShopButton").addEventListener("click", () => game.closeShop());
    document.getElementById("sellAllButton").addEventListener("click", () => game.shop.sellAll());
    document.getElementById("restartButton").addEventListener("click", () => game.restart());
    document.getElementById("resumeButton").addEventListener("click", () => game.togglePause());
    document.getElementById("mainMenuButton").addEventListener("click", () => game.returnToMainMenu());
    document.getElementById("cheatStage10Button").addEventListener("click", () => this.runCheat(() => game.cheatJumpToStage(10), "Stage 10 unlocked."));
    document.getElementById("cheatFieldBossButton").addEventListener("click", () => this.runCheat(() => game.cheatSpawnFieldBoss(), "Field Boss spawned."));
    document.getElementById("cheatCastleButton").addEventListener("click", () => this.runCheat(() => game.cheatUnlockCastle(), "Castle unlocked."));
    document.getElementById("cheatCastleBossButton").addEventListener("click", () => this.runCheat(() => game.cheatSpawnCastleBoss(), "Castle Boss spawned."));
    document.getElementById("cheatGearButton").addEventListener("click", () => this.runCheat(() => game.cheatEquipTestGear(), "Test gear equipped."));
    this.masterVolumeSlider.addEventListener("input", () => {
      const volume = game.audio.setMasterVolume(Number(this.masterVolumeSlider.value) / 100);
      this.masterVolumeValue.textContent = `${Math.round(volume * 100)}%`;
    });
    this.warriorButton.addEventListener("click", () => this.selectClass("warrior"));
    this.rangerButton.addEventListener("click", () => this.selectClass("ranger"));
    this.startRunButton.addEventListener("click", () => game.startGame(this.selectedClassId));
    this.startMusicButton.addEventListener("click", () => game.toggleMusic());
    this.hudMusicButton.addEventListener("click", () => game.toggleMusic());
    for (const [tab, button] of Object.entries(this.shopTabs)) {
      button.addEventListener("click", () => this.setShopTab(tab));
    }
    this.selectClass("warrior");
    this.masterVolumeSlider.value = Math.round(game.audio.masterVolume * 100);
    this.masterVolumeValue.textContent = `${this.masterVolumeSlider.value}%`;
  }

  runCheat(action, message) {
    action();
    this.cheatStatus.textContent = message;
    this.renderInventory();
    this.renderShop();
    this.update();
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
    const stageZone = this.game.currentStageZone();
    this.dangerText.textContent = this.game.stageGateBossActive()
      ? `Stage ${this.game.dangerLevel} ${this.game.castleStageGateBossRequired() ? "Castle Boss" : "Field Boss"}`
      : this.game.canEarnDangerProgress()
      ? `Stage ${this.game.dangerLevel} ${stageZone.shortName} ${this.game.dangerProgress}/${this.game.dangerProgressGoal()}`
      : `Stage ${this.game.dangerLevel} ${stageZone.shortName} / Cap ${this.game.maxDangerUnlocked}`;
    this.dangerBar.style.width = this.game.canEarnDangerProgress()
      ? `${clamp((this.game.dangerProgress / this.game.dangerProgressGoal()) * 100, 0, 100)}%`
      : "0%";
    this.dayText.textContent = this.game.day;
    this.updateBossBar();
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
    this.inventoryText.textContent = `Inventory ${p.inventoryCount()}/${p.inventoryCapacity} items | ${equippedCount}/6 equipped | Tab`;

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
    const pauseHidden = !this.game.paused
      || this.inventoryOpen
      || this.game.shopOpen
      || this.game.gameOver
      || !this.game.started
      || this.game.layoutEditor.active;
    this.pauseOverlay.classList.toggle("hidden", pauseHidden);
    this.pauseOverlay.setAttribute("aria-hidden", String(pauseHidden));
    this.gameOverOverlay.classList.toggle("hidden", !this.game.gameOver);
    this.gameOverOverlay.setAttribute("aria-hidden", String(!this.game.gameOver));
    this.updateMusicButtons();
  }

  updateBossBar() {
    const boss = this.game.monsters.find((monster) => monster.isFieldBoss || monster.isCastleBoss);
    const visible = Boolean(boss) && this.game.started && !this.game.gameOver;
    this.bossBar.classList.toggle("hidden", !visible);
    this.bossBar.setAttribute("aria-hidden", String(!visible));
    if (!visible) return;
    this.bossName.textContent = boss.name;
    this.bossRole.textContent = boss.isCastleBoss ? "Castle Boss" : "Field Boss";
    this.bossHealthBar.style.width = `${clamp((boss.health / boss.maxHealth) * 100, 0, 100)}%`;
  }

  renderShop() {
    this.setShopTab(this.activeShopTab);
    const p = this.game.player;
    this.sellList.innerHTML = "";
    const sellableItems = p.unequippedItems();
    for (const item of sellableItems) {
      const row = document.createElement("div");
      row.className = `shop-row rarity-${item.rarity}`;
      row.innerHTML = `
        <span class="item-icon small" style="background-image:url('${ItemSystem.itemIconPath(item)}')" aria-hidden="true"></span>
        <div><strong>${item.name}</strong><small>${ITEM_SLOT_LABELS[item.slot]} | Level ${item.itemLevel} | ${this.itemStatsText(item)} | ${item.sellValue} gold</small></div>
      `;
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

    this.renderShopServices(p);

    this.dangerList.innerHTML = "";
    const note = document.createElement("div");
    note.className = "danger-note";
    note.textContent = this.game.stageGateBossActive()
      ? "Defeat the Field Boss to unlock Castle."
      : this.game.dangerLevel === this.game.maxDangerUnlocked
      ? `Next unlock: ${this.game.dangerProgress}/${this.game.dangerProgressGoal()} progress.`
      : "Lower stage selected. New stages will not unlock.";
    this.dangerList.appendChild(note);
    this.renderStageGroups();
  }

  renderStageGroups() {
    for (let zoneIndex = 0; zoneIndex < CONFIG.stageZones.length; zoneIndex += 1) {
      const zone = CONFIG.stageZones[zoneIndex];
      const nextZone = CONFIG.stageZones[zoneIndex + 1];
      const firstLevel = zone.minStage;
      const lastLevel = Math.min(this.game.maxDangerUnlocked, nextZone ? nextZone.minStage - 1 : this.game.maxDangerUnlocked);
      if (lastLevel < firstLevel) continue;

      const section = document.createElement("section");
      section.className = `stage-zone stage-zone-${zone.theme}`;

      const header = document.createElement("div");
      header.className = "stage-zone-header";
      const rangeText = nextZone ? `Stages ${firstLevel}-${nextZone.minStage - 1}` : `Stages ${firstLevel}+`;
      header.innerHTML = `<strong>${zone.name}</strong><small>${rangeText}</small>`;
      section.appendChild(header);

      const buttons = document.createElement("div");
      buttons.className = "stage-zone-buttons";
      for (let level = firstLevel; level <= lastLevel; level += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${level}`;
        button.className = level === this.game.dangerLevel ? "active" : "";
        button.title = level === this.game.dangerLevel ? "Current stage" : `Switch to stage ${level}`;
        button.addEventListener("click", () => this.game.setDangerLevel(level));
        buttons.appendChild(button);
      }
      section.appendChild(buttons);
      this.dangerList.appendChild(section);
    }
  }

  renderShopServices(player) {
    this.servicesList.innerHTML = "";
    this.addServiceRow({
      title: "Expand Backpack",
      detail: this.game.shop.nextBackpackUpgrade()
        ? `Add ${this.game.shop.nextBackpackUpgrade().slots} backpack slots. Current capacity: ${player.inventoryCapacity}.`
        : `Maximum capacity reached: ${player.inventoryCapacity}.`,
      price: this.game.shop.nextBackpackUpgrade()?.price,
      serviceIcon: "assets/icons/backpack_service_icon.png",
      disabled: !this.game.shop.nextBackpackUpgrade() || player.gold < this.game.shop.nextBackpackUpgrade().price,
      action: () => this.game.shop.buyBackpackUpgrade()
    });

    const healCost = this.game.shop.healCost();
    this.addServiceRow({
      title: "Heal to Full",
      detail: healCost > 0 ? `Restore ${player.maxHealth - Math.ceil(player.health)} missing HP.` : "You are already fully healed.",
      price: healCost,
      serviceIcon: "assets/icons/heal_service_icon.png",
      disabled: healCost <= 0 || player.gold < healCost,
      action: () => this.game.shop.healToFull()
    });

    const mysteryCost = this.game.shop.mysteryItemCost();
    this.addServiceRow({
      title: "Mystery Equipment",
      detail: `Buy one random ${player.className} item for Stage ${this.game.dangerLevel}.`,
      price: mysteryCost,
      serviceIcon: "assets/icons/mystery_item_icon.png",
      disabled: player.gold < mysteryCost || !player.hasInventorySpace(),
      action: () => this.game.shop.buyMysteryItem()
    });

    const eligibleItems = player.unequippedItems().filter((item) => this.game.shop.rarityUpgradeCost(item));
    if (!eligibleItems.length) {
      this.addServiceRow({
        title: "Improve Rarity",
        detail: "Bring a spare Common, Uncommon, or Rare item to upgrade it. Epic is the current limit.",
        price: null,
        serviceIcon: "assets/icons/rarity_upgrade_icon.png",
        disabled: true
      });
      return;
    }

    for (const item of eligibleItems) {
      const nextRarity = ItemSystem.nextRarity(item.rarity);
      const cost = this.game.shop.rarityUpgradeCost(item);
      this.addServiceRow({
        title: `Improve ${item.name}`,
        detail: `${ITEM_RARITY_RULES[item.rarity].label} -> ${ITEM_RARITY_RULES[nextRarity].label}. Rerolls stats at the same item level.`,
        price: cost,
        iconItem: item,
        serviceIcon: "assets/icons/rarity_upgrade_icon.png",
        disabled: player.gold < cost,
        action: () => this.game.shop.upgradeItemRarity(item.uniqueId)
      });
    }
  }

  addServiceRow({ title, detail, price, disabled, action, iconItem = null, serviceIcon = "" }) {
    const row = document.createElement("div");
    row.className = `shop-row ${iconItem ? `rarity-${iconItem.rarity}` : ""}`;
    row.innerHTML = `
      <span class="item-icon small service" style="background-image:url('${serviceIcon || (iconItem ? ItemSystem.itemIconPath(iconItem) : "")}')" aria-hidden="true"></span>
      <div><strong>${title}</strong><small>${detail}${price === null || price === undefined ? "" : ` | ${price} gold`}</small></div>
    `;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = price === null || price === undefined ? "Locked" : "Buy";
    button.disabled = disabled;
    if (action) button.addEventListener("click", action);
    row.appendChild(button);
    this.servicesList.appendChild(row);
  }

  renderInventory() {
    const p = this.game.player;
    const backpackItems = p.unequippedItems();
    this.itemListTitle.textContent = `Backpack ${p.inventoryCount()}/${p.inventoryCapacity}`;
    this.itemListHint.textContent = p.inventoryCount() >= CONFIG.inventory.capacity
      ? "Backpack full. Sell gear before picking up more."
      : "Equipped gear uses no backpack slots.";
    this.renderInventorySummary();
    this.equipmentSlots.innerHTML = "";
    for (const slot of ITEM_SLOT_ORDER) {
      const item = p.equipment[slot];
      const canUnequip = p.canUnequipSlot(slot);
      const row = document.createElement("button");
      row.type = "button";
      row.className = `equipment-slot ${item ? `rarity-${item.rarity}` : ""}`;
      row.disabled = !item || !canUnequip;
      const iconPath = item ? ItemSystem.itemIconPath(item) : ItemSystem.slotIconPath(slot);
      row.innerHTML = item
        ? `<span>${ITEM_SLOT_LABELS[slot]}</span><span class="item-icon equipment" style="background-image:url('${iconPath}')" aria-hidden="true"></span><strong>${item.name}</strong><small>${canUnequip ? this.itemStatsText(item) : "Backpack full"}</small>`
        : `<span>${ITEM_SLOT_LABELS[slot]}</span><span class="item-icon equipment empty" style="background-image:url('${iconPath}')" aria-hidden="true"></span><strong>${this.emptySlotSymbol(slot)}</strong><small>Empty slot</small>`;
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
        <span class="item-icon backpack" style="background-image:url('${ItemSystem.itemIconPath(item)}')" aria-hidden="true"></span>
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

  }

  renderInventorySummary() {
    const p = this.game.player;
    this.inventoryHeroPortrait.className = `inventory-hero-portrait ${p.classId}`;
    this.inventoryHeroPortrait.innerHTML = `
      <span class="hero-shadow"></span>
      <span class="hero-sprite"></span>
      <strong>${p.className}</strong>
    `;
    const stats = [
      ["HP", `${Math.ceil(p.health)} / ${p.maxHealth}`],
      ["Damage", p.damage],
      ["Speed", p.speed],
      ["Attack speed", `+${this.formatStatValue(p.attackSpeed, "attackSpeed")}`],
      ["Crit", `${this.formatStatValue(p.critChance, "critChance")} / ${this.formatStatValue(p.critDamage, "critDamage")}`],
      ["Gold", p.gold]
    ];
    this.inventoryStatList.innerHTML = stats.map(([label, value]) => `
      <div class="inventory-stat-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join("");
  }

  emptySlotSymbol(slot) {
    return {
      weapon: "Sword",
      helmet: "Helm",
      armor: "Vest",
      boots: "Boots",
      accessory: "Charm",
      ring: "Ring"
    }[slot] || "Empty";
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
    this.gameOverStats.textContent = `Jobs: ${this.game.day} | Kills: ${this.game.kills} | Gold earned: ${this.game.totalGoldEarned} | Stage reached: ${this.game.dangerLevel}`;
  }
}


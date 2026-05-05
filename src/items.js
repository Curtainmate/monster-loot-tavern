const ITEM_SLOTS = Object.freeze({
  WEAPON: "weapon",
  ARMOR: "armor",
  BOOTS: "boots",
  ACCESSORY: "accessory"
});

const ITEM_RARITIES = Object.freeze({
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic"
});

const ITEM_RARITY_RULES = Object.freeze({
  common: { label: "Common", statMultiplier: 1, sellMultiplier: 1 },
  uncommon: { label: "Uncommon", statMultiplier: 1.25, sellMultiplier: 1.8 },
  rare: { label: "Rare", statMultiplier: 1.6, sellMultiplier: 3 },
  epic: { label: "Epic", statMultiplier: 2.1, sellMultiplier: 5 }
});

const ITEM_TEMPLATES = Object.freeze({
  warrior: [
    {
      id: "warrior_sword",
      name: "Sword",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "warrior",
      baseStats: { damage: 4 },
      statGrowth: { damage: 1.4 },
      baseSellValue: 8
    },
    {
      id: "warrior_axe",
      name: "Axe",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "warrior",
      baseStats: { damage: 6, attackCooldown: 0.03 },
      statGrowth: { damage: 1.7, attackCooldown: 0.005 },
      baseSellValue: 10
    },
    {
      id: "warrior_plate",
      name: "Plate Armor",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "warrior",
      baseStats: { maxHealth: 18 },
      statGrowth: { maxHealth: 5 },
      baseSellValue: 9
    },
    {
      id: "warrior_guard",
      name: "Guard Vest",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "warrior",
      baseStats: { maxHealth: 12, damageReduction: 0.03 },
      statGrowth: { maxHealth: 4, damageReduction: 0.005 },
      baseSellValue: 10
    },
    {
      id: "warrior_greaves",
      name: "Greaves",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "warrior",
      baseStats: { speed: 12 },
      statGrowth: { speed: 2.5 },
      baseSellValue: 7
    },
    {
      id: "warrior_charge_boots",
      name: "Charge Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "warrior",
      baseStats: { speed: 8, damage: 2 },
      statGrowth: { speed: 2, damage: 0.6 },
      baseSellValue: 9
    },
    {
      id: "warrior_charm",
      name: "Warrior Charm",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "warrior",
      baseStats: { bonusDamage: 3 },
      statGrowth: { bonusDamage: 1 },
      baseSellValue: 8
    },
    {
      id: "warrior_talisman",
      name: "Stone Talisman",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "warrior",
      baseStats: { maxHealth: 8, bossDamageBonus: 0.04 },
      statGrowth: { maxHealth: 2.5, bossDamageBonus: 0.006 },
      baseSellValue: 10
    }
  ],
  ranger: [
    {
      id: "ranger_bow",
      name: "Bow",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "ranger",
      baseStats: { damage: 3, arrowSpeed: 30 },
      statGrowth: { damage: 1.1, arrowSpeed: 7 },
      baseSellValue: 8
    },
    {
      id: "ranger_crossbow",
      name: "Crossbow",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "ranger",
      baseStats: { damage: 5, arrowRange: 25 },
      statGrowth: { damage: 1.4, arrowRange: 6 },
      baseSellValue: 10
    },
    {
      id: "ranger_leathers",
      name: "Leather Tunic",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "ranger",
      baseStats: { maxHealth: 12 },
      statGrowth: { maxHealth: 4 },
      baseSellValue: 8
    },
    {
      id: "ranger_cloak",
      name: "Hunter Cloak",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "ranger",
      baseStats: { maxHealth: 8, speed: 8 },
      statGrowth: { maxHealth: 3, speed: 1.8 },
      baseSellValue: 10
    },
    {
      id: "ranger_boots",
      name: "Scout Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "ranger",
      baseStats: { speed: 14 },
      statGrowth: { speed: 3 },
      baseSellValue: 7
    },
    {
      id: "ranger_pathfinders",
      name: "Pathfinder Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "ranger",
      baseStats: { speed: 10, arrowRange: 18 },
      statGrowth: { speed: 2.4, arrowRange: 5 },
      baseSellValue: 9
    },
    {
      id: "ranger_quiver",
      name: "Lucky Quiver",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "ranger",
      baseStats: { arrowRange: 28, bonusDamage: 1 },
      statGrowth: { arrowRange: 7, bonusDamage: 0.5 },
      baseSellValue: 8
    },
    {
      id: "ranger_focus",
      name: "Focus Charm",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "ranger",
      baseStats: { longRangeBonus: 0.04 },
      statGrowth: { longRangeBonus: 0.008 },
      baseSellValue: 10
    }
  ]
});

let nextItemId = 1;

function generateItem(options = {}) {
  const classRestriction = options.classRestriction || options.classId || randomFrom(Object.keys(ITEM_TEMPLATES));
  const itemLevel = Math.max(1, Math.floor(options.itemLevel || 1));
  const rarity = ITEM_RARITY_RULES[options.rarity] ? options.rarity : rollRarity();
  const templates = ITEM_TEMPLATES[classRestriction] || ITEM_TEMPLATES.warrior;
  const slotTemplates = options.slot ? templates.filter((template) => template.slot === options.slot) : templates;
  const selectedTemplates = slotTemplates.length ? slotTemplates : templates;
  const template = options.templateId
    ? selectedTemplates.find((candidate) => candidate.id === options.templateId) || selectedTemplates[0]
    : randomFrom(selectedTemplates);
  const rarityRule = ITEM_RARITY_RULES[rarity];
  const stats = rollItemStats(template, itemLevel, rarityRule.statMultiplier);
  const rarityName = rarityRule.label;

  return {
    uniqueId: `item_${Date.now().toString(36)}_${nextItemId++}`,
    templateId: template.id,
    name: `${rarityName} ${template.name}`,
    slot: template.slot,
    rarity,
    itemLevel,
    classRestriction: template.classRestriction,
    stats,
    sellValue: calculateItemSellValue(template, itemLevel, rarityRule.sellMultiplier)
  };
}

function rollItemStats(template, itemLevel, rarityMultiplier) {
  const stats = {};
  for (const [stat, baseValue] of Object.entries(template.baseStats)) {
    const growth = template.statGrowth[stat] || 0;
    const rawValue = (baseValue + growth * (itemLevel - 1)) * rarityMultiplier;
    stats[stat] = normalizeStatValue(stat, rawValue);
  }
  return stats;
}

function calculateItemSellValue(template, itemLevel, rarityMultiplier) {
  return Math.max(1, Math.round((template.baseSellValue + itemLevel * 2) * rarityMultiplier));
}

function normalizeStatValue(stat, value) {
  if (stat.includes("Bonus") || stat === "damageReduction" || stat === "attackCooldown") {
    return Number(value.toFixed(3));
  }
  return Math.max(1, Math.round(value));
}

function rollRarity() {
  const roll = Math.random();
  if (roll < 0.58) return ITEM_RARITIES.COMMON;
  if (roll < 0.84) return ITEM_RARITIES.UNCOMMON;
  if (roll < 0.96) return ITEM_RARITIES.RARE;
  return ITEM_RARITIES.EPIC;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const ItemSystem = Object.freeze({
  ITEM_SLOTS,
  ITEM_RARITIES,
  ITEM_RARITY_RULES,
  ITEM_TEMPLATES,
  generateItem
});

globalThis.ItemSystem = ItemSystem;

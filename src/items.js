const ITEM_SLOTS = Object.freeze({
  WEAPON: "weapon",
  HELMET: "helmet",
  ARMOR: "armor",
  BOOTS: "boots",
  ACCESSORY: "accessory",
  RING: "ring"
});

const ITEM_SLOT_ORDER = Object.freeze([
  ITEM_SLOTS.WEAPON,
  ITEM_SLOTS.HELMET,
  ITEM_SLOTS.ARMOR,
  ITEM_SLOTS.BOOTS,
  ITEM_SLOTS.ACCESSORY,
  ITEM_SLOTS.RING
]);

const ITEM_SLOT_LABELS = Object.freeze({
  weapon: "Weapon",
  helmet: "Helmet",
  armor: "Armor",
  boots: "Boots",
  accessory: "Accessory",
  ring: "Ring"
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

const ITEM_DROP_CHANCES = Object.freeze({
  normalMonster: 0.15,
  eliteMonster: 0.25,
  boss: 1,
  chest: 0.35
});

const ITEM_RARITY_TABLES = Object.freeze([
  { minStage: 1, common: 0.78, uncommon: 0.18, rare: 0.04, epic: 0 },
  { minStage: 5, common: 0.68, uncommon: 0.24, rare: 0.07, epic: 0.01 },
  { minStage: 10, common: 0.58, uncommon: 0.29, rare: 0.11, epic: 0.02 },
  { minStage: 15, common: 0.48, uncommon: 0.34, rare: 0.15, epic: 0.03 }
]);

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
      id: "warrior_plate",
      name: "Plate Armor",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "warrior",
      baseStats: { maxHealth: 18 },
      statGrowth: { maxHealth: 5 },
      baseSellValue: 9
    },
    {
      id: "warrior_helm",
      name: "Iron Helm",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "warrior",
      baseStats: { maxHealth: 10, damageReduction: 0.02 },
      statGrowth: { maxHealth: 3, damageReduction: 0.004 },
      baseSellValue: 8
    },
    {
      id: "warrior_horned_helm",
      name: "Horned Helm",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "warrior",
      baseStats: { maxHealth: 8, damage: 2 },
      statGrowth: { maxHealth: 2.5, damage: 0.7 },
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
    },
    {
      id: "warrior_band",
      name: "Iron Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "warrior",
      baseStats: { damage: 2, maxHealth: 5 },
      statGrowth: { damage: 0.7, maxHealth: 1.8 },
      baseSellValue: 8
    },
    {
      id: "warrior_blood_ring",
      name: "Blood Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "warrior",
      baseStats: { bossDamageBonus: 0.04, bonusDamage: 1 },
      statGrowth: { bossDamageBonus: 0.006, bonusDamage: 0.4 },
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
      id: "ranger_leathers",
      name: "Leather Tunic",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "ranger",
      baseStats: { maxHealth: 12 },
      statGrowth: { maxHealth: 4 },
      baseSellValue: 8
    },
    {
      id: "ranger_cap",
      name: "Scout Cap",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "ranger",
      baseStats: { maxHealth: 7, arrowRange: 16 },
      statGrowth: { maxHealth: 2.5, arrowRange: 4 },
      baseSellValue: 8
    },
    {
      id: "ranger_hood",
      name: "Hunter Hood",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "ranger",
      baseStats: { damage: 1, longRangeBonus: 0.03 },
      statGrowth: { damage: 0.5, longRangeBonus: 0.006 },
      baseSellValue: 9
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
    },
    {
      id: "ranger_signet",
      name: "Archer Signet",
      slot: ITEM_SLOTS.RING,
      classRestriction: "ranger",
      baseStats: { arrowSpeed: 24, damage: 1 },
      statGrowth: { arrowSpeed: 6, damage: 0.5 },
      baseSellValue: 8
    },
    {
      id: "ranger_moon_ring",
      name: "Moon Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "ranger",
      baseStats: { arrowPierce: 1, arrowRange: 12 },
      statGrowth: { arrowRange: 4 },
      baseSellValue: 10
    }
  ]
});

let nextItemId = 1;

function generateItem(options = {}) {
  const classRestriction = options.classRestriction || options.classId || randomFrom(Object.keys(ITEM_TEMPLATES));
  const itemLevel = Math.max(1, Math.floor(options.itemLevel || itemLevelForStage(options.stage || 1)));
  const rarity = ITEM_RARITY_RULES[options.rarity] ? options.rarity : rollRarityForStage(options.stage || itemLevel);
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

function itemLevelForStage(stage) {
  return Math.max(1, Math.floor(stage || 1));
}

function rollItemDropChance(source, context = {}) {
  const chance = itemDropChance(source, context);
  return Math.random() < chance;
}

function itemDropChance(source, context = {}) {
  if (source === "boss" || context.isBoss) return ITEM_DROP_CHANCES.boss;
  if (source === "chest") return ITEM_DROP_CHANCES.chest;
  if (source === "monster" && (context.isElite || context.variantData)) return ITEM_DROP_CHANCES.eliteMonster;
  if (source === "eliteMonster") return ITEM_DROP_CHANCES.eliteMonster;
  return ITEM_DROP_CHANCES.normalMonster;
}

function rollRarityForStage(stage) {
  const table = rarityTableForStage(stage);
  const roll = Math.random();
  let cumulative = 0;
  for (const rarity of [ITEM_RARITIES.COMMON, ITEM_RARITIES.UNCOMMON, ITEM_RARITIES.RARE, ITEM_RARITIES.EPIC]) {
    cumulative += table[rarity] || 0;
    if (roll <= cumulative) return rarity;
  }
  return ITEM_RARITIES.COMMON;
}

function rarityTableForStage(stage) {
  const normalizedStage = Math.max(1, Math.floor(stage || 1));
  let selected = ITEM_RARITY_TABLES[0];
  for (const table of ITEM_RARITY_TABLES) {
    if (normalizedStage >= table.minStage) selected = table;
  }
  return selected;
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

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const ItemSystem = Object.freeze({
  ITEM_SLOTS,
  ITEM_SLOT_ORDER,
  ITEM_SLOT_LABELS,
  ITEM_RARITIES,
  ITEM_RARITY_RULES,
  ITEM_DROP_CHANCES,
  ITEM_RARITY_TABLES,
  ITEM_TEMPLATES,
  generateItem,
  itemLevelForStage,
  rollItemDropChance,
  itemDropChance,
  rollRarityForStage,
  rarityTableForStage
});

globalThis.ItemSystem = ItemSystem;

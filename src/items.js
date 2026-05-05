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
  EPIC: "epic",
  LEGENDARY: "legendary"
});

const ITEM_RARITY_RULES = Object.freeze({
  common: { label: "Common", statCount: 1, statMultiplier: 1, sellMultiplier: 1 },
  uncommon: { label: "Uncommon", statCount: 1, statMultiplier: 1.45, sellMultiplier: 1.8 },
  rare: { label: "Rare", statCount: 2, statMultiplier: 1.25, sellMultiplier: 3 },
  epic: { label: "Epic", statCount: 3, statMultiplier: 1.35, sellMultiplier: 5 },
  legendary: { label: "Legendary", statCount: 4, statMultiplier: 1.5, sellMultiplier: 8 }
});

const ITEM_DROP_CHANCES = Object.freeze({
  normalMonster: 0.15,
  eliteMonster: 0.25,
  boss: 1,
  chest: 0.35
});

const ITEM_RARITY_TABLES = Object.freeze([
  { minStage: 1, common: 0.78, uncommon: 0.18, rare: 0.04, epic: 0, legendary: 0 },
  { minStage: 5, common: 0.67, uncommon: 0.24, rare: 0.08, epic: 0.01, legendary: 0 },
  { minStage: 10, common: 0.56, uncommon: 0.29, rare: 0.12, epic: 0.028, legendary: 0.002 },
  { minStage: 15, common: 0.46, uncommon: 0.34, rare: 0.155, epic: 0.04, legendary: 0.005 },
  { minStage: 20, common: 0.38, uncommon: 0.35, rare: 0.19, epic: 0.07, legendary: 0.01 }
]);

const ITEM_STAT_RULES = Object.freeze({
  damage: { base: 2, growth: 0.85, type: "flat" },
  maxHealth: { base: 8, growth: 3.2, type: "flat" },
  damageReduction: { base: 0.02, growth: 0.003, type: "percent" },
  speed: { base: 7, growth: 1.8, type: "flat" },
  attackSpeed: { base: 0.04, growth: 0.006, type: "percent" },
  critChance: { base: 0.04, growth: 0.004, type: "percent" },
  critDamage: { base: 0.18, growth: 0.02, type: "percent" },
  bossDamage: { base: 0.06, growth: 0.008, type: "percent" },
  longRangeDamage: { base: 0.06, growth: 0.008, type: "percent" },
  arrowSpeed: { base: 22, growth: 5, type: "flat" },
  arrowRange: { base: 18, growth: 5, type: "flat" },
  arrowPierce: { base: 1, growth: 0, type: "integer" },
  pickupRange: { base: 8, growth: 2, type: "flat" },
  goldFind: { base: 0.08, growth: 0.01, type: "percent" },
  itemFind: { base: 0.05, growth: 0.008, type: "percent" }
});

const ITEM_TEMPLATES = Object.freeze({
  warrior: [
    {
      id: "warrior_sword",
      name: "Sword",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "warrior",
      primaryStat: "damage",
      statPool: ["damage", "attackSpeed", "critChance", "critDamage", "bossDamage"],
      baseSellValue: 8
    },
    {
      id: "warrior_plate",
      name: "Plate Armor",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "warrior",
      primaryStat: "maxHealth",
      statPool: ["maxHealth", "damageReduction", "speed", "pickupRange", "goldFind"],
      baseSellValue: 9
    },
    {
      id: "warrior_helm",
      name: "Iron Helm",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "warrior",
      primaryStat: "maxHealth",
      statPool: ["maxHealth", "damageReduction", "attackSpeed", "critChance", "bossDamage"],
      baseSellValue: 8
    },
    {
      id: "warrior_horned_helm",
      name: "Horned Helm",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "warrior",
      primaryStat: "damage",
      statPool: ["damage", "maxHealth", "damageReduction", "critChance", "bossDamage"],
      baseSellValue: 9
    },
    {
      id: "warrior_guard",
      name: "Guard Vest",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "warrior",
      primaryStat: "damageReduction",
      statPool: ["damageReduction", "maxHealth", "speed", "pickupRange", "itemFind"],
      baseSellValue: 10
    },
    {
      id: "warrior_greaves",
      name: "Greaves",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "warrior",
      primaryStat: "speed",
      statPool: ["speed", "damageReduction", "attackSpeed", "pickupRange", "goldFind"],
      baseSellValue: 7
    },
    {
      id: "warrior_charge_boots",
      name: "Charge Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "warrior",
      primaryStat: "speed",
      statPool: ["speed", "damage", "attackSpeed", "pickupRange", "goldFind"],
      baseSellValue: 9
    },
    {
      id: "warrior_charm",
      name: "Warrior Charm",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "warrior",
      primaryStat: "damage",
      statPool: ["damage", "critChance", "bossDamage", "goldFind", "itemFind"],
      baseSellValue: 8
    },
    {
      id: "warrior_talisman",
      name: "Stone Talisman",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "warrior",
      primaryStat: "bossDamage",
      statPool: ["bossDamage", "maxHealth", "damageReduction", "goldFind", "itemFind"],
      baseSellValue: 10
    },
    {
      id: "warrior_band",
      name: "Iron Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "warrior",
      primaryStat: "damage",
      statPool: ["damage", "maxHealth", "critChance", "critDamage", "itemFind"],
      baseSellValue: 8
    },
    {
      id: "warrior_blood_ring",
      name: "Blood Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "warrior",
      primaryStat: "critDamage",
      statPool: ["critDamage", "damage", "critChance", "bossDamage", "maxHealth"],
      baseSellValue: 10
    }
  ],
  ranger: [
    {
      id: "ranger_bow",
      name: "Bow",
      slot: ITEM_SLOTS.WEAPON,
      classRestriction: "ranger",
      primaryStat: "damage",
      statPool: ["damage", "attackSpeed", "critChance", "critDamage", "arrowPierce", "arrowRange", "arrowSpeed"],
      baseSellValue: 8
    },
    {
      id: "ranger_leathers",
      name: "Leather Tunic",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "ranger",
      primaryStat: "maxHealth",
      statPool: ["maxHealth", "damageReduction", "speed", "longRangeDamage", "itemFind"],
      baseSellValue: 8
    },
    {
      id: "ranger_cap",
      name: "Scout Cap",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "ranger",
      primaryStat: "arrowRange",
      statPool: ["arrowRange", "maxHealth", "damageReduction", "critChance", "longRangeDamage"],
      baseSellValue: 8
    },
    {
      id: "ranger_hood",
      name: "Hunter Hood",
      slot: ITEM_SLOTS.HELMET,
      classRestriction: "ranger",
      primaryStat: "critChance",
      statPool: ["critChance", "damage", "maxHealth", "arrowRange", "longRangeDamage"],
      baseSellValue: 9
    },
    {
      id: "ranger_cloak",
      name: "Hunter Cloak",
      slot: ITEM_SLOTS.ARMOR,
      classRestriction: "ranger",
      primaryStat: "speed",
      statPool: ["speed", "maxHealth", "damageReduction", "longRangeDamage", "itemFind"],
      baseSellValue: 10
    },
    {
      id: "ranger_boots",
      name: "Scout Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "ranger",
      primaryStat: "speed",
      statPool: ["speed", "arrowRange", "attackSpeed", "pickupRange", "goldFind"],
      baseSellValue: 7
    },
    {
      id: "ranger_pathfinders",
      name: "Pathfinder Boots",
      slot: ITEM_SLOTS.BOOTS,
      classRestriction: "ranger",
      primaryStat: "speed",
      statPool: ["speed", "arrowRange", "attackSpeed", "pickupRange", "itemFind"],
      baseSellValue: 9
    },
    {
      id: "ranger_quiver",
      name: "Lucky Quiver",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "ranger",
      primaryStat: "arrowRange",
      statPool: ["arrowRange", "damage", "arrowSpeed", "arrowPierce", "longRangeDamage", "itemFind"],
      baseSellValue: 8
    },
    {
      id: "ranger_focus",
      name: "Focus Charm",
      slot: ITEM_SLOTS.ACCESSORY,
      classRestriction: "ranger",
      primaryStat: "longRangeDamage",
      statPool: ["longRangeDamage", "critChance", "critDamage", "arrowSpeed", "itemFind"],
      baseSellValue: 10
    },
    {
      id: "ranger_signet",
      name: "Archer Signet",
      slot: ITEM_SLOTS.RING,
      classRestriction: "ranger",
      primaryStat: "damage",
      statPool: ["damage", "critChance", "critDamage", "arrowRange", "goldFind"],
      baseSellValue: 8
    },
    {
      id: "ranger_moon_ring",
      name: "Moon Ring",
      slot: ITEM_SLOTS.RING,
      classRestriction: "ranger",
      primaryStat: "arrowPierce",
      statPool: ["arrowPierce", "damage", "critChance", "arrowRange", "longRangeDamage"],
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
  const stats = rollItemStats(template, itemLevel, rarityRule);
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
    specialEffect: null,
    sellValue: calculateItemSellValue(template, itemLevel, rarityRule.sellMultiplier)
  };
}

function itemLevelForStage(stage) {
  return Math.max(1, Math.floor(stage || 1));
}

function rollItemDropChance(source, context = {}) {
  const chance = itemDropChance(source, context) * (1 + (context.itemFind || 0));
  return Math.random() < Math.min(1, chance);
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
  for (const rarity of Object.values(ITEM_RARITIES)) {
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

function rollItemStats(template, itemLevel, rarityRule) {
  const stats = {};
  const statCount = Math.min(rarityRule.statCount, template.statPool.length);
  const selectedStats = [template.primaryStat];
  const remainingStats = template.statPool.filter((stat) => stat !== template.primaryStat);
  while (selectedStats.length < statCount && remainingStats.length) {
    const index = Math.floor(Math.random() * remainingStats.length);
    selectedStats.push(remainingStats.splice(index, 1)[0]);
  }

  for (const stat of selectedStats) {
    stats[stat] = rollStatValue(stat, itemLevel, rarityRule.statMultiplier);
  }
  return stats;
}

function rollStatValue(stat, itemLevel, rarityMultiplier) {
  const rule = ITEM_STAT_RULES[stat] || ITEM_STAT_RULES.damage;
  const variance = 0.9 + Math.random() * 0.2;
  const rawValue = (rule.base + rule.growth * (itemLevel - 1)) * rarityMultiplier * variance;
  return normalizeStatValue(stat, rawValue);
}

function calculateItemSellValue(template, itemLevel, rarityMultiplier) {
  return Math.max(1, Math.round((template.baseSellValue + itemLevel * 2) * rarityMultiplier));
}

function normalizeStatValue(stat, value) {
  const rule = ITEM_STAT_RULES[stat] || ITEM_STAT_RULES.damage;
  if (rule.type === "percent") return Number(value.toFixed(3));
  if (rule.type === "integer") return Math.max(1, Math.round(value));
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
  ITEM_STAT_RULES,
  ITEM_TEMPLATES,
  generateItem,
  itemLevelForStage,
  rollItemDropChance,
  itemDropChance,
  rollRarityForStage,
  rarityTableForStage
});

globalThis.ItemSystem = ItemSystem;

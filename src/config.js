const CONFIG = {
  world: { width: 1900, height: 1100 },
  tavern: { x: 160, y: 150, width: 520, height: 360 },
  door: { x: 672, y: 300, width: 44, height: 80 },
  transition: { x: 650, y: 280, width: 96, height: 122 },
  field: { x: 720, y: 80, width: 1100, height: 900 },
  scenery: {
    rocks: [[890, 180], [1220, 315], [1000, 700], [1420, 760], [1665, 255], [1700, 830]],
    trees: [[80, 120], [100, 610], [710, 65], [1510, 85], [1535, 900], [740, 910], [1320, 40], [1815, 130], [1810, 940]]
  },
  blockers: [
    { x: 145, y: 132, width: 550, height: 22 },
    { x: 145, y: 510, width: 550, height: 22 },
    { x: 145, y: 132, width: 22, height: 400 },
    { x: 680, y: 132, width: 22, height: 166 },
    { x: 680, y: 382, width: 22, height: 150 },
    { x: 184, y: 242, width: 250, height: 54 },
    { x: 452, y: 172, width: 82, height: 82 },
    { x: 890, y: 180, width: 32, height: 22 },
    { x: 1220, y: 315, width: 32, height: 22 },
    { x: 1000, y: 700, width: 32, height: 22 },
    { x: 1420, y: 760, width: 32, height: 22 },
    { x: 1665, y: 255, width: 32, height: 22 },
    { x: 1700, y: 830, width: 32, height: 22 },
    { x: 92, y: 150, width: 20, height: 38 },
    { x: 112, y: 640, width: 20, height: 30 },
    { x: 722, y: 95, width: 20, height: 30 },
    { x: 1522, y: 115, width: 20, height: 30 },
    { x: 1547, y: 930, width: 20, height: 30 },
    { x: 752, y: 940, width: 20, height: 30 },
    { x: 1332, y: 70, width: 20, height: 30 },
    { x: 1827, y: 160, width: 20, height: 30 },
    { x: 1822, y: 970, width: 20, height: 30 }
  ],
  player: {
    x: 380,
    y: 330,
    size: 28,
    speed: 185,
    maxHealth: 100,
    damage: 12,
    cooldown: 0.34,
    invulnerableTime: 0.85
  },
  spawns: {
    monsterMinPlayerDistance: 260,
    bossMinPlayerDistance: 340
  },
  classes: {
    warrior: {
      name: "Warrior",
      sprite: "player",
      attackType: "melee",
      maxHealth: 100,
      speed: 185,
      damage: 12,
      cooldown: 0.34
    },
    ranger: {
      name: "Ranger",
      sprite: "ranger",
      attackType: "ranged",
      maxHealth: 80,
      speed: 205,
      damage: 8,
      cooldown: 0.45,
      arrowSpeed: 560,
      arrowRange: 440,
      arrowPierce: 0
    }
  },
  lootValues: {
    "Slime Gel": 3,
    "Goblin Ear": 8,
    "Wolf Pelt": 7,
    "Rusty Dagger": 14,
    "Monster Fang": 11
  },
  upgradeChains: {
    warrior: {
      sword: [
        { name: "Iron Sword", price: 45, damage: 10, description: "+10 weapon damage" },
        { name: "Steel Sword", price: 95, damage: 10, description: "+10 more weapon damage" },
        { name: "Mythril Sword", price: 170, damage: 14, description: "+14 more weapon damage" }
      ],
      armor: [
        { name: "Leather Armor", price: 40, health: 35, description: "+35 max health and heal" },
        { name: "Chainmail", price: 90, health: 45, description: "+45 max health and heal" },
        { name: "Knight Plate", price: 165, health: 60, description: "+60 max health and heal" }
      ],
      boots: [
        { name: "Hunter Boots", price: 35, speed: 35, description: "+35 movement speed" },
        { name: "Wind Boots", price: 80, speed: 30, description: "+30 more movement speed" },
        { name: "Storm Boots", price: 150, speed: 35, description: "+35 more movement speed" }
      ],
      amulet: [
        { name: "Fire Amulet", price: 70, bonusDamage: 8, description: "+8 bonus attack damage" },
        { name: "Ember Amulet", price: 130, bonusDamage: 10, description: "+10 more bonus attack damage" },
        { name: "Phoenix Amulet", price: 220, bonusDamage: 14, description: "+14 more bonus attack damage" }
      ]
    },
    ranger: {
      bow: [
        { name: "Hunter Bow", price: 45, damage: 7, description: "+7 arrow damage" },
        { name: "Longbow", price: 95, damage: 8, description: "+8 more arrow damage" },
        { name: "Runewood Bow", price: 170, damage: 11, description: "+11 more arrow damage" }
      ],
      armor: [
        { name: "Padded Vest", price: 40, health: 25, description: "+25 max health and heal" },
        { name: "Scout Mail", price: 90, health: 35, description: "+35 max health and heal" },
        { name: "Dragonhide Coat", price: 165, health: 45, description: "+45 max health and heal" }
      ],
      boots: [
        { name: "Trail Boots", price: 35, speed: 30, description: "+30 movement speed" },
        { name: "Falcon Boots", price: 80, speed: 30, description: "+30 more movement speed" },
        { name: "Windstep Boots", price: 150, speed: 35, description: "+35 more movement speed" }
      ],
      charm: [
        { name: "Hawk Charm", price: 70, arrowSpeed: 120, arrowRange: 80, description: "+arrow speed and range" },
        { name: "Eagle Charm", price: 130, cooldownReduction: 0.08, description: "Faster bow attacks" },
        { name: "Storm Charm", price: 220, arrowPierce: 1, bonusDamage: 4, description: "Arrows pierce once and deal +4 damage" }
      ]
    }
  },
  consumables: [
    { id: "healingPotion", name: "Healing Potion", price: 12, type: "consumable", description: "Restore 35 health" }
  ],
  masteryPrices: [350, 750, 1400],
  masteryChains: {
    warrior: {
      multiSwing: {
        name: "Multi-Swing",
        tiers: [
          { name: "Sweeping Technique", extraSwings: 1, description: "+1 swing direction" },
          { name: "Whirlwind Form", extraSwings: 1, description: "+2 total swing directions" },
          { name: "Storm of Steel", extraSwings: 1, description: "+3 total swing directions" }
        ]
      },
      momentum: {
        name: "Battle Momentum",
        tiers: [
          { name: "Battle Rhythm", momentumReduction: 0.08, momentumDuration: 2, description: "Kills briefly speed up attacks" },
          { name: "Blood Rush", momentumReduction: 0.12, momentumDuration: 3, description: "Kills speed up attacks longer" },
          { name: "War Trance", momentumReduction: 0.16, momentumDuration: 4, description: "Kills trigger a strong attack-speed burst" }
        ]
      },
      guardBreaker: {
        name: "Guard Breaker",
        tiers: [
          { name: "Cracking Blows", bossDamageBonus: 0.1, description: "+10% damage to bosses" },
          { name: "Armor Splitter", bossDamageBonus: 0.1, description: "+20% total damage to bosses" },
          { name: "Titan Breaker", bossDamageBonus: 0.1, description: "+30% total damage to bosses" }
        ]
      }
    },
    ranger: {
      multiShot: {
        name: "Multi-Shot",
        tiers: [
          { name: "Twin Shot", extraArrows: 1, description: "+1 arrow per attack" },
          { name: "Triple Shot", extraArrows: 1, description: "+2 total arrows per attack" },
          { name: "Arrow Storm", extraArrows: 1, description: "+3 total arrows per attack" }
        ]
      },
      piercingShot: {
        name: "Piercing Shot",
        tiers: [
          { name: "Barbed Arrows", arrowPierce: 1, description: "+1 arrow pierce" },
          { name: "Bodkin Arrows", arrowPierce: 1, description: "+2 total arrow pierce" },
          { name: "Phantom Arrows", arrowPierce: 1, description: "+3 total arrow pierce" }
        ]
      },
      predatorFocus: {
        name: "Predator Focus",
        tiers: [
          { name: "Keen Eye", longRangeBonus: 0.1, description: "+10% damage at long range" },
          { name: "Patient Hunter", longRangeBonus: 0.1, description: "+20% total damage at long range" },
          { name: "Apex Focus", longRangeBonus: 0.1, description: "+30% total damage at long range" }
        ]
      }
    }
  },
  chests: {
    minDelay: 24,
    maxDelay: 42,
    maxActive: 2
  },
  powerups: {
    minDelay: 12,
    maxDelay: 22,
    maxActive: 3,
    despawnTime: 24,
    heartHeal: 28,
    types: {
      rage: { name: "Rage Rune", shortName: "Rage", duration: 10, damageMultiplier: 1.5, color: "#e4564d" },
      heart: { name: "Heart", shortName: "Heart", heal: 28, color: "#ff6d7a" },
      haste: { name: "Haste Feather", shortName: "Haste", duration: 10, speedMultiplier: 1.35, color: "#86d7ff" },
      shield: { name: "Shield Charm", shortName: "Shield", duration: 5, color: "#8fb5ff" },
      cleave: { name: "Cleave", shortName: "Cleave", duration: 10, color: "#ffd46b" }
    }
  },
  dangerProgress: {
    baseGoal: 24,
    perLevel: 8,
    normalKill: 3,
    bossKill: 12,
    questComplete: 10,
    saleGoldDivisor: 10
  },
  bosses: {
    minDelay: 42,
    maxDelay: 72,
    maxActive: 1,
    types: {
      slime: { title: "Giant Slime", health: 5.2, damage: 1.45, speed: 0.72, size: 52, tint: "#7aff8a" },
      goblin: { title: "Goblin Brute", health: 4.3, damage: 1.7, speed: 0.86, size: 54, tint: "#d1b05b" },
      wolf: { title: "Alpha Wolf", health: 3.6, damage: 1.5, speed: 1.08, size: 50, tint: "#e6e0c8" }
    }
  },
  monsterVariants: {
    eliteStartStage: 10,
    types: {
      slime: {
        id: "yellow",
        name: "Yellow Slime",
        bossTitle: "Golden Slime King",
        sprite: "slime_yellow",
        color: "#f2d62d",
        tint: "#ffdf45",
        health: 1.38,
        damage: 1.18,
        speed: 1.08,
        attackCooldown: 0.95,
        extraLoot: [["Monster Fang", 0.24], ["Slime Gel", 0.45]],
        bonusLootChance: 0.3
      },
      goblin: {
        id: "red",
        name: "Red Goblin",
        bossTitle: "Red Goblin Warlord",
        sprite: "goblin_red",
        color: "#c94828",
        tint: "#ff6b42",
        health: 1.32,
        damage: 1.28,
        speed: 1.12,
        attackCooldown: 0.92,
        extraLoot: [["Monster Fang", 0.28], ["Rusty Dagger", 0.28]],
        bonusLootChance: 0.35
      },
      wolf: {
        id: "black",
        name: "Black Wolf",
        bossTitle: "Black Alpha Wolf",
        sprite: "wolf_black",
        color: "#30313c",
        tint: "#73758d",
        health: 1.26,
        damage: 1.18,
        speed: 1.18,
        attackCooldown: 0.85,
        extraLoot: [["Monster Fang", 0.32], ["Wolf Pelt", 0.36]],
        bonusLootChance: 0.34
      }
    }
  },
  quests: [
    { goal: "Hunt 4 monsters, then return to the tavern.", kills: 4, reward: 12 },
    { goal: "Collect 6 pieces of loot, then return to the tavern.", loot: 6, reward: 18 },
    { goal: "Earn 40 gold from selling loot, then return to the tavern.", gold: 40, reward: 25 },
    { goal: "Hunt 10 monsters in one day, then return to the tavern.", kills: 10, reward: 40 }
  ],
  monsters: {
    slime: {
      name: "Slime",
      color: "#61c96f",
      size: 26,
      speed: 58,
      health: 24,
      damage: 8,
      attackCooldown: 0.9,
      score: 1,
      loot: [["Slime Gel", 0.85], ["Monster Fang", 0.12]]
    },
    goblin: {
      name: "Goblin",
      color: "#7db15c",
      size: 28,
      speed: 88,
      health: 42,
      damage: 13,
      attackCooldown: 0.8,
      score: 2,
      loot: [["Goblin Ear", 0.78], ["Rusty Dagger", 0.18], ["Monster Fang", 0.2]]
    },
    wolf: {
      name: "Wolf",
      color: "#b9b4a3",
      size: 24,
      speed: 130,
      health: 30,
      damage: 10,
      attackCooldown: 0.7,
      score: 2,
      loot: [["Wolf Pelt", 0.72], ["Monster Fang", 0.22]]
    }
  }
};


const CONFIG = {
  world: { width: 1900, height: 1100 },
  tavern: { x: 160, y: 150, width: 520, height: 360 },
  door: { x: 672, y: 300, width: 44, height: 80 },
  transition: { x: 650, y: 280, width: 96, height: 122 },
  field: { x: 720, y: 80, width: 1100, height: 900 },
  stageZones: [
    { minStage: 1, name: "Green Field", shortName: "Field", theme: "field", statMultiplier: { health: 1, damage: 1 } },
    { minStage: 11, name: "Abandoned Castle", shortName: "Castle", theme: "castle", statMultiplier: { health: 1.1, damage: 1.1 } }
  ],
  fieldStageRules: {
    1: {
      maxMonsters: 5,
      waveSize: [1, 1],
      spawnInterval: 2.4,
      spawns: [{ type: "slime", weight: 100 }],
      bosses: []
    },
    2: {
      maxMonsters: 6,
      waveSize: [1, 1],
      spawnInterval: 2.2,
      spawns: [{ type: "slime", weight: 80 }, { type: "goblin", weight: 20 }],
      bosses: []
    },
    3: {
      maxMonsters: 7,
      waveSize: [1, 1],
      spawnInterval: 2,
      spawns: [{ type: "slime", weight: 75 }, { type: "goblin", weight: 25 }],
      bosses: [{ type: "slime", weight: 100 }]
    },
    4: {
      maxMonsters: 8,
      waveSize: [1, 1],
      spawnInterval: 1.9,
      spawns: [{ type: "slime", weight: 60 }, { type: "goblin", weight: 25 }, { type: "wolf", weight: 15 }],
      bosses: []
    },
    5: {
      maxMonsters: 9,
      waveSize: [1, 2],
      spawnInterval: 1.75,
      spawns: [{ type: "slime", weight: 45 }, { type: "slime", variant: "yellow", weight: 5 }, { type: "goblin", weight: 30 }, { type: "wolf", weight: 20 }],
      bosses: []
    },
    6: {
      maxMonsters: 10,
      waveSize: [1, 2],
      spawnInterval: 1.65,
      spawns: [{ type: "slime", weight: 30 }, { type: "slime", variant: "yellow", weight: 5 }, { type: "goblin", weight: 50 }, { type: "goblin", variant: "red", weight: 10 }, { type: "wolf", weight: 5 }],
      bosses: [{ type: "goblin", variant: "red", weight: 100 }]
    },
    7: {
      maxMonsters: 11,
      waveSize: [1, 2],
      spawnInterval: 1.55,
      spawns: [{ type: "slime", weight: 35 }, { type: "slime", variant: "yellow", weight: 15 }, { type: "goblin", weight: 30 }, { type: "goblin", variant: "red", weight: 10 }, { type: "wolf", weight: 10 }],
      bosses: []
    },
    8: {
      maxMonsters: 12,
      waveSize: [2, 2],
      spawnInterval: 1.4,
      spawns: [{ type: "slime", weight: 25 }, { type: "slime", variant: "yellow", weight: 15 }, { type: "goblin", weight: 25 }, { type: "goblin", variant: "red", weight: 10 }, { type: "wolf", weight: 20 }, { type: "wolf", variant: "black", weight: 5 }],
      bosses: []
    },
    9: {
      maxMonsters: 13,
      waveSize: [2, 2],
      spawnInterval: 1.3,
      spawns: [{ type: "slime", weight: 15 }, { type: "slime", variant: "yellow", weight: 15 }, { type: "goblin", weight: 15 }, { type: "goblin", variant: "red", weight: 10 }, { type: "wolf", weight: 35 }, { type: "wolf", variant: "black", weight: 10 }],
      bosses: [{ type: "wolf", variant: "black", weight: 100 }]
    },
    10: {
      maxMonsters: 14,
      waveSize: [2, 3],
      spawnInterval: 1.2,
      spawns: [{ type: "slime", weight: 15 }, { type: "slime", variant: "yellow", weight: 25 }, { type: "goblin", weight: 15 }, { type: "goblin", variant: "red", weight: 20 }, { type: "wolf", weight: 10 }, { type: "wolf", variant: "black", weight: 15 }],
      bosses: []
    },
    11: {
      maxMonsters: 15,
      waveSize: [2, 3],
      spawnInterval: 1.18,
      spawns: [{ type: "goblin", variant: "red", weight: 25 }, { type: "wolf", variant: "black", weight: 20 }, { type: "skeleton", weight: 55 }],
      bosses: []
    },
    12: {
      maxMonsters: 16,
      waveSize: [2, 3],
      spawnInterval: 1.15,
      spawns: [{ type: "goblin", variant: "red", weight: 18 }, { type: "wolf", variant: "black", weight: 16 }, { type: "skeleton", weight: 50 }, { type: "skeletonArcher", weight: 16 }],
      bosses: []
    },
    13: {
      maxMonsters: 17,
      waveSize: [2, 3],
      spawnInterval: 1.1,
      spawns: [{ type: "goblin", variant: "red", weight: 12 }, { type: "wolf", variant: "black", weight: 12 }, { type: "skeleton", weight: 48 }, { type: "skeletonArcher", weight: 16 }, { type: "gargoyle", weight: 12 }],
      bosses: [{ type: "skeleton", weight: 100 }]
    },
    14: {
      maxMonsters: 18,
      waveSize: [2, 3],
      spawnInterval: 1.05,
      spawns: [{ type: "goblin", variant: "red", weight: 10 }, { type: "wolf", variant: "black", weight: 10 }, { type: "skeleton", weight: 34 }, { type: "skeleton", variant: "black", weight: 8 }, { type: "skeletonArcher", weight: 20 }, { type: "gargoyle", weight: 18 }],
      bosses: []
    },
    15: {
      maxMonsters: 19,
      waveSize: [2, 4],
      spawnInterval: 1,
      spawns: [{ type: "skeleton", weight: 30 }, { type: "skeleton", variant: "black", weight: 14 }, { type: "skeletonArcher", weight: 18 }, { type: "skeletonArcher", variant: "black", weight: 4 }, { type: "gargoyle", weight: 28 }, { type: "goblin", variant: "red", weight: 6 }],
      bosses: []
    },
    16: {
      maxMonsters: 20,
      waveSize: [2, 4],
      spawnInterval: 0.96,
      spawns: [{ type: "skeleton", weight: 25 }, { type: "skeleton", variant: "black", weight: 13 }, { type: "skeletonArcher", weight: 22 }, { type: "skeletonArcher", variant: "black", weight: 6 }, { type: "gargoyle", weight: 26 }, { type: "gargoyle", variant: "moss", weight: 8 }],
      bosses: [{ type: "skeletonArcher", variant: "black", weight: 100 }]
    },
    17: {
      maxMonsters: 21,
      waveSize: [2, 4],
      spawnInterval: 0.92,
      spawns: [{ type: "skeleton", weight: 22 }, { type: "skeleton", variant: "black", weight: 14 }, { type: "skeletonArcher", weight: 20 }, { type: "skeletonArcher", variant: "black", weight: 10 }, { type: "gargoyle", weight: 24 }, { type: "gargoyle", variant: "moss", weight: 10 }],
      bosses: []
    },
    18: {
      maxMonsters: 22,
      waveSize: [3, 4],
      spawnInterval: 0.88,
      spawns: [{ type: "skeleton", weight: 18 }, { type: "skeleton", variant: "black", weight: 16 }, { type: "skeletonArcher", weight: 18 }, { type: "skeletonArcher", variant: "black", weight: 12 }, { type: "gargoyle", weight: 22 }, { type: "gargoyle", variant: "moss", weight: 14 }],
      bosses: []
    },
    19: {
      maxMonsters: 23,
      waveSize: [3, 4],
      spawnInterval: 0.84,
      spawns: [{ type: "skeleton", weight: 14 }, { type: "skeleton", variant: "black", weight: 18 }, { type: "skeletonArcher", weight: 16 }, { type: "skeletonArcher", variant: "black", weight: 16 }, { type: "gargoyle", weight: 18 }, { type: "gargoyle", variant: "moss", weight: 18 }],
      bosses: [{ type: "gargoyle", variant: "moss", weight: 100 }]
    },
    20: {
      maxMonsters: 24,
      waveSize: [3, 5],
      spawnInterval: 0.8,
      spawns: [{ type: "skeleton", weight: 10 }, { type: "skeleton", variant: "black", weight: 22 }, { type: "skeletonArcher", weight: 14 }, { type: "skeletonArcher", variant: "black", weight: 20 }, { type: "gargoyle", weight: 14 }, { type: "gargoyle", variant: "moss", weight: 20 }],
      bosses: []
    }
  },
  scenery: {
    rocks: [[890, 180], [1220, 315], [1000, 700], [1420, 760], [1665, 255], [1700, 830]],
    trees: [[80, 120], [100, 610], [710, 65], [1510, 85], [1535, 900], [740, 910], [1320, 40], [1815, 130], [1810, 940]],
    tavern: {
      floorProps: [
        { image: "tavern_rug", x: 160, y: 184, width: 190, height: 68 }
      ],
      backProps: [
        { image: "tavern_fireplace", x: 200, y: 120, width: 106, height: 102 },
        { image: "tavern_shelf", x: 560, y: 160, width: 118, height: 98 }
      ],
      frontProps: [
        { image: "tavern_counter", x: 472, y: 232, width: 172, height: 88 },
        { image: "tavern_table", x: 200, y: 280, width: 100, height: 74 },
        { image: "tavern_chair", x: 288, y: 280, width: 50, height: 62 },
        { image: "tavern_chair", x: 160, y: 280, width: 50, height: 62 },
        { image: "tavern_crate", x: 464, y: 144, width: 48, height: 48 },
        { image: "tavern_crate", x: 440, y: 152, width: 46, height: 46 }
      ]
    },
    castle: {
      walls: [[820, 155], [1245, 120], [1520, 220], [915, 765], [1340, 835], [1630, 680]],
      pillars: [[965, 310], [1460, 360], [1110, 635], [1715, 470]],
      deadTrees: [[780, 520], [1195, 205], [1580, 845], [1745, 255]],
      crackedTiles: [[885, 245], [1160, 500], [1440, 665], [1665, 340], [1010, 820]]
    }
  },
  blockers: [
    { x: 145, y: 132, width: 550, height: 22 },
    { x: 145, y: 510, width: 550, height: 22 },
    { x: 145, y: 132, width: 22, height: 400 },
    { x: 680, y: 132, width: 22, height: 166 },
    { x: 680, y: 382, width: 22, height: 150 },
    { x: 482, y: 272, width: 152, height: 42 },
    { x: 210, y: 164, width: 84, height: 44 },
    { x: 570, y: 196, width: 96, height: 38 },
    { x: 208, y: 310, width: 80, height: 30 },
    { x: 470, y: 164, width: 34, height: 22 },
    { x: 446, y: 172, width: 34, height: 22 },
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
  inventory: {
    capacity: 10
  },
  shopServices: {
    backpackUpgrades: [
      { slots: 5, price: 150 },
      { slots: 5, price: 350 },
      { slots: 5, price: 800 }
    ],
    healBasePrice: 25,
    healPerMissingHp: 1,
    mysteryItemBasePrice: 120,
    mysteryItemStagePrice: 12,
    rarityUpgradePrices: {
      common: 140,
      uncommon: 360,
      rare: 900
    }
  },
  spawns: {
    monsterMinPlayerDistance: 260,
    bossMinPlayerDistance: 340
  },
  fieldBoss: {
    gateStage: 10,
    unlockStage: 11,
    type: "warboss",
    name: "Goblin Warboar Rider",
    health: 520,
    damage: 18,
    chargeDamage: 34,
    speed: 76,
    chargeSpeed: 420,
    chargeRange: 500,
    chargeDistance: 520,
    chargeWindup: 0.45,
    chargeRecover: 0.85,
    chargeCooldown: 5.5,
    size: 78,
    gold: 120
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
  coins: {
    bronze: { name: "Bronze Coin", value: 1 },
    silver: { name: "Silver Coin", value: 5 },
    gold: { name: "Gold Coin", value: 20 }
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
      wolf: { title: "Alpha Wolf", health: 3.6, damage: 1.5, speed: 1.08, size: 50, tint: "#e6e0c8" },
      skeleton: { title: "Skeleton Captain", health: 4.1, damage: 1.55, speed: 0.9, size: 54, tint: "#e9dfbf" },
      skeletonArcher: { title: "Bone Marksman", health: 3.6, damage: 1.45, speed: 0.88, size: 52, tint: "#d6c8a2" },
      gargoyle: { title: "Stone Gargoyle", health: 3.8, damage: 1.45, speed: 1.08, size: 54, tint: "#aeb7b5" }
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
        health: 1.5,
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
        health: 1.45,
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
        health: 1.38,
        damage: 1.18,
        speed: 1.18,
        attackCooldown: 0.85,
        extraLoot: [["Monster Fang", 0.32], ["Wolf Pelt", 0.36]],
        bonusLootChance: 0.34
      },
      skeleton: {
        id: "black",
        name: "Black Skeleton",
        bossTitle: "Black Skeleton Captain",
        sprite: "skeleton_black",
        color: "#4f525d",
        tint: "#8d91a0",
        health: 1.4,
        damage: 1.2,
        speed: 1,
        attackCooldown: 0.96,
        extraLoot: [["Monster Fang", 0.34], ["Rusty Dagger", 0.32]],
        bonusLootChance: 0.36
      },
      skeletonArcher: {
        id: "black",
        name: "Black Skeleton Archer",
        bossTitle: "Black Bone Marksman",
        sprite: "skeleton_archer_black",
        color: "#4b4e58",
        tint: "#8d91a0",
        health: 1.25,
        damage: 1.2,
        speed: 1,
        attackCooldown: 0.9,
        extraLoot: [["Monster Fang", 0.36], ["Rusty Dagger", 0.28]],
        bonusLootChance: 0.36
      },
      gargoyle: {
        id: "moss",
        name: "Moss Gargoyle",
        bossTitle: "Moss Stone Gargoyle",
        sprite: "gargoyle_moss",
        color: "#62aa60",
        tint: "#8fdd78",
        health: 1.3,
        damage: 1.15,
        speed: 1.08,
        attackCooldown: 0.92,
        extraLoot: [["Monster Fang", 0.42]],
        bonusLootChance: 0.38
      }
    }
  },
  contracts: {
    rewardRarities: [
      { minStage: 1, weights: { uncommon: 85, rare: 15 } },
      { minStage: 6, weights: { uncommon: 55, rare: 43, epic: 2 } },
      { minStage: 10, weights: { uncommon: 35, rare: 58, epic: 7 } },
      { minStage: 15, weights: { uncommon: 20, rare: 66, epic: 14 } }
    ],
    templates: [
      {
        id: "hunt",
        label: "Monster Hunt",
        text: "Hunt {goal} monsters.",
        metric: "kills",
        baseGoal: 24,
        perStage: 2,
        gold: 35,
        stageGold: 6,
        minStage: 1
      },
      {
        id: "tier2",
        label: "Elite Cull",
        text: "Defeat {goal} Tier 2 monsters.",
        metric: "tier2Kills",
        baseGoal: 8,
        perStage: 1,
        gold: 55,
        stageGold: 8,
        minStage: 5
      },
      {
        id: "chests",
        label: "Treasure Run",
        text: "Open {goal} treasure chests.",
        metric: "chests",
        baseGoal: 3,
        perStage: 0.12,
        gold: 45,
        stageGold: 7,
        minStage: 3
      },
      {
        id: "gold",
        label: "Gold Sweep",
        text: "Collect {goal} gold from the field.",
        metric: "gold",
        baseGoal: 160,
        perStage: 24,
        gold: 50,
        stageGold: 6,
        minStage: 4
      },
      {
        id: "miniboss",
        label: "Bounty Hunt",
        text: "Defeat {goal} minibosses.",
        metric: "minibossKills",
        baseGoal: 2,
        perStage: 0.08,
        gold: 80,
        stageGold: 10,
        minStage: 6
      }
    ]
  },
  monsters: {
    slime: {
      name: "Slime",
      color: "#61c96f",
      size: 26,
      speed: 58,
      health: 24,
      damage: 8,
      gold: 3,
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
      gold: 8,
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
      gold: 7,
      attackCooldown: 0.7,
      score: 2,
      loot: [["Wolf Pelt", 0.72], ["Monster Fang", 0.22]]
    },
    skeleton: {
      name: "Skeleton",
      color: "#d8d0b7",
      size: 28,
      speed: 84,
      health: 58,
      damage: 15,
      gold: 11,
      attackCooldown: 0.82,
      score: 3,
      loot: [["Monster Fang", 0.28], ["Rusty Dagger", 0.24]]
    },
    skeletonArcher: {
      name: "Skeleton Archer",
      color: "#cec2a2",
      size: 28,
      speed: 72,
      health: 46,
      damage: 13,
      gold: 12,
      attackCooldown: 1.55,
      score: 3,
      ranged: { range: 430, projectileSpeed: 260, projectileSize: 9 },
      loot: [["Monster Fang", 0.3], ["Rusty Dagger", 0.22]]
    },
    gargoyle: {
      name: "Gargoyle",
      color: "#8e9898",
      size: 26,
      speed: 136,
      health: 48,
      damage: 14,
      gold: 13,
      attackCooldown: 0.68,
      score: 3,
      loot: [["Monster Fang", 0.38]]
    }
  }
};


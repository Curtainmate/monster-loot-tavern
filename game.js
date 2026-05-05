"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

const keys = new Set();
const mouse = { x: 0, y: 0, worldX: 0, worldY: 0, down: false };

function movementKey(event) {
  const key = event.key.toLowerCase();
  const codeMap = {
    KeyW: "w",
    KeyA: "a",
    KeyS: "s",
    KeyD: "d",
    ArrowUp: "arrowup",
    ArrowDown: "arrowdown",
    ArrowLeft: "arrowleft",
    ArrowRight: "arrowright",
    Space: " "
  };
  return codeMap[event.code] || key;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function rotateVector(vector, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos
  };
}

function rectContains(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function entityRect(entity, x = entity.x, y = entity.y) {
  return {
    x: x - entity.size / 2,
    y: y - entity.size / 2,
    width: entity.size,
    height: entity.size
  };
}

function drawRectSprite(x, y, width, height, fill, outline = "#17110d") {
  ctx.fillStyle = outline;
  ctx.fillRect(Math.floor(x - width / 2), Math.floor(y - height / 2), width, height);
  ctx.fillStyle = fill;
  ctx.fillRect(Math.floor(x - width / 2 + 3), Math.floor(y - height / 2 + 3), width - 6, height - 6);
}

function drawPixelSprite(sprite, x, y, scale = 3, flip = false) {
  for (const part of sprite) {
    const px = flip ? -part.x - part.w : part.x;
    ctx.fillStyle = part.color;
    ctx.fillRect(
      Math.floor(x + px * scale),
      Math.floor(y + part.y * scale),
      part.w * scale,
      part.h * scale
    );
  }
}

class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = false;
  }

  unlock() {
    if (this.enabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.enabled = true;
  }

  tone(frequency, duration, type = "square", volume = 0.045) {
    if (!this.enabled || !this.context) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  play(name) {
    const sounds = {
      attack: () => this.tone(330, 0.06, "square", 0.035),
      hit: () => this.tone(140, 0.08, "sawtooth", 0.04),
      hurt: () => this.tone(95, 0.16, "triangle", 0.055),
      loot: () => {
        this.tone(660, 0.05, "square", 0.03);
        setTimeout(() => this.tone(880, 0.06, "square", 0.025), 50);
      },
      sell: () => this.tone(520, 0.08, "triangle", 0.035),
      buy: () => {
        this.tone(440, 0.08, "triangle", 0.035);
        setTimeout(() => this.tone(720, 0.09, "triangle", 0.03), 80);
      },
      day: () => {
        this.tone(392, 0.08, "square", 0.035);
        setTimeout(() => this.tone(523, 0.1, "square", 0.032), 90);
      },
      gameOver: () => this.tone(70, 0.35, "sawtooth", 0.055)
    };
    if (sounds[name]) sounds[name]();
  }
}

class SpriteSheet {
  constructor() {
    this.images = {};
    this.loaded = {};
    this.frameSize = 144;
    this.chestFrameSize = 160;
    this.powerupFrameSize = 128;
    this.lootSize = 16;
    this.tileSize = 32;
    this.lootFrames = {
      "Slime Gel": 0,
      "Goblin Ear": 1,
      "Wolf Pelt": 2,
      "Rusty Dagger": 3,
      "Monster Fang": 4
    };
    this.powerupFrames = {
      rage: 0,
      heart: 1,
      haste: 2,
      shield: 3,
      cleave: 4
    };
    this.tileFrames = {
      grass: 0,
      grassFlowers: 1,
      dirt: 2,
      tavernFloor: 3,
      wall: 4,
      door: 5,
      fieldEdge: 6,
      rock: 7,
      tree: 8,
      bush: 9,
      counter: 10,
      stump: 11
    };
    for (const name of ["player", "ranger", "slime", "slime_yellow", "goblin", "goblin_red", "wolf", "wolf_black", "loot", "powerups", "tileset", "chest", "shopkeeper"]) {
      const image = new Image();
      image.onload = () => {
        this.loaded[name] = true;
      };
      image.onerror = () => {
        this.loaded[name] = false;
      };
      image.src = `assets/${name}.png`;
      this.images[name] = image;
      this.loaded[name] = false;
    }

    this.player = [
      [
        { x: -4, y: -8, w: 8, h: 4, color: "#f3c58b" },
        { x: -5, y: -4, w: 10, h: 8, color: "#3d78d8" },
        { x: -6, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 2, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 4, y: -2, w: 5, h: 3, color: "#d9d2c1" }
      ],
      [
        { x: -4, y: -8, w: 8, h: 4, color: "#f3c58b" },
        { x: -5, y: -4, w: 10, h: 8, color: "#4c8deb" },
        { x: -7, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 3, y: 4, w: 4, h: 5, color: "#2b4c9d" },
        { x: 4, y: -1, w: 5, h: 3, color: "#d9d2c1" }
      ]
    ];
  }

  drawImageFrame(name, frame, frameWidth, frameHeight, x, y, drawWidth, drawHeight, row = 0, flip = false) {
    const image = this.images[name];
    if (!this.loaded[name] || !image) return false;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (flip) {
      ctx.translate(Math.floor(x + drawWidth), Math.floor(y));
      ctx.scale(-1, 1);
      ctx.drawImage(image, frame * frameWidth, row * frameHeight, frameWidth, frameHeight, 0, 0, drawWidth, drawHeight);
    } else {
      ctx.drawImage(image, frame * frameWidth, row * frameHeight, frameWidth, frameHeight, Math.floor(x), Math.floor(y), drawWidth, drawHeight);
    }
    ctx.restore();
    return true;
  }

  drawPlayer(player, camera) {
    const sx = player.x - camera.x;
    const sy = player.y - camera.y;
    const flash = player.invulnerableLeft > 0 && Math.floor(player.invulnerableLeft * 16) % 2 === 0;
    const attacking = player.cooldownLeft > player.attackCooldown - 0.18;
    const pose = this.directionalPose(player.facing, Math.floor(player.walkFrame) % 2 === 1, attacking);
    const drawSize = 84;
    const drawn = this.drawImageFrame(player.spriteName, pose.frame, this.frameSize, this.frameSize, sx - drawSize / 2, sy - drawSize * 0.76, drawSize, drawSize, 0, pose.flip);
    if (drawn) {
      if (flash) {
        ctx.globalAlpha = 0.34;
        ctx.fillStyle = "#fff6cc";
        ctx.fillRect(Math.floor(sx - 31), Math.floor(sy - 49), 62, 66);
        ctx.globalAlpha = 1;
      }
      return;
    }

    ctx.save();
    if (flash) ctx.globalAlpha = 0.55;
    drawPixelSprite(this.player[Math.floor(player.walkFrame) % 2], sx, sy, 3, player.facing.x < -0.15);
    ctx.restore();
  }

  drawMonster(monster, camera) {
    const sx = monster.x - camera.x;
    const sy = monster.y - camera.y;
    const pose = this.directionalPose({ x: monster.lastMoveX, y: monster.lastMoveY }, Math.floor(monster.walkFrame) % 2 === 1, monster.hitFlash > 0);
    const baseSize = { slime: 62, goblin: 78, wolf: 72 }[monster.type] || 74;
    const drawSize = monster.isBoss ? baseSize * 1.55 : baseSize;
    const drawn = this.drawImageFrame(monster.spriteName, pose.frame, this.frameSize, this.frameSize, sx - drawSize / 2, sy - drawSize * 0.76, drawSize, drawSize, 0, pose.flip);
    if (drawn) {
      if (monster.isBoss) {
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = monster.bossTint;
        ctx.fillRect(Math.floor(sx - drawSize / 2), Math.floor(sy - drawSize * 0.76), drawSize, drawSize);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffe18a";
        ctx.fillRect(Math.floor(sx - 18), Math.floor(sy - monster.size / 2 - 18), 36, 4);
      }
      if (monster.hitFlash > 0) {
        ctx.globalAlpha = 0.32;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.floor(sx - drawSize / 2), Math.floor(sy - drawSize * 0.76), drawSize, drawSize);
        ctx.globalAlpha = 1;
      }
      return;
    }

    const pulse = monster.type === "slime" ? Math.sin(monster.walkFrame) * 2 : 0;
    const color = monster.hitFlash > 0 ? "#ffffff" : monster.color;
    drawRectSprite(sx, sy + pulse, monster.size, monster.size, color);
    if (monster.type === "goblin") {
      ctx.fillStyle = "#ded28b";
      ctx.fillRect(Math.floor(sx - 12), Math.floor(sy - 14), 7, 7);
      ctx.fillRect(Math.floor(sx + 5), Math.floor(sy - 14), 7, 7);
    } else if (monster.type === "wolf") {
      ctx.fillStyle = "#f2f0dd";
      ctx.fillRect(Math.floor(sx - 10), Math.floor(sy + 8), 5, 4);
      ctx.fillRect(Math.floor(sx + 5), Math.floor(sy + 8), 5, 4);
    }
    ctx.fillStyle = "#19120d";
    ctx.fillRect(Math.floor(sx - 6), Math.floor(sy - 4), 4, 4);
    ctx.fillRect(Math.floor(sx + 3), Math.floor(sy - 4), 4, 4);
  }

  drawLoot(loot, camera) {
    const frame = this.lootFrames[loot.name] || 0;
    const sx = loot.x - camera.x;
    const sy = loot.y - camera.y + Math.sin(loot.life * 5) * 2;
    return this.drawImageFrame("loot", frame, 16, 16, sx - 16, sy - 16, 32, 32);
  }

  drawPowerup(powerup, camera) {
    const frame = this.powerupFrames[powerup.type] || 0;
    const sx = powerup.x - camera.x;
    const sy = powerup.y - camera.y + Math.sin(powerup.life * 5.4) * 2;
    return this.drawImageFrame("powerups", frame, this.powerupFrameSize, this.powerupFrameSize, sx - 19, sy - 19, 38, 38);
  }

  drawChest(chest, camera) {
    const frame = chest.opened ? 3 : Math.floor(chest.life * 3) % 3;
    const sx = chest.x - camera.x;
    const sy = chest.y - camera.y + Math.sin(chest.life * 2.4) * 1.5;
    return this.drawImageFrame("chest", frame, this.chestFrameSize, this.chestFrameSize, sx - 39, sy - 58, 78, 78);
  }

  drawShopkeeper(shopkeeper, camera) {
    const sx = shopkeeper.x - camera.x;
    const sy = shopkeeper.y - camera.y;
    return this.drawImageFrame("shopkeeper", 0, 160, 160, sx - 55, sy - 97, 110, 110);
  }

  directionalPose(vector, alternate = false, action = false) {
    if (vector.y < -0.55 && Math.abs(vector.y) > Math.abs(vector.x)) {
      return { frame: alternate || action ? 5 : 1, flip: false };
    }
    if (Math.abs(vector.x) > 0.35) {
      if (vector.x < 0) {
        return { frame: alternate || action ? 6 : 2, flip: false };
      }
      return { frame: alternate || action ? 7 : 3, flip: false };
    }
    return { frame: alternate || action ? 4 : 0, flip: false };
  }

  drawTile(frameName, x, y, size = 32) {
    const frame = this.tileFrames[frameName] || 0;
    const row = frame >= 8 ? 1 : 0;
    const col = frame % 8;
    return this.drawImageFrame("tileset", col, 32, 32, x, y, size, size, row);
  }

  drawTiledArea(frameName, worldRect, camera, size = 32, alternateFrame = null) {
    for (let y = worldRect.y; y < worldRect.y + worldRect.height; y += size) {
      for (let x = worldRect.x; x < worldRect.x + worldRect.width; x += size) {
        const frame = alternateFrame && ((x / size + y / size) % 5 === 0) ? alternateFrame : frameName;
        this.drawTile(frame, x - camera.x, y - camera.y, size);
      }
    }
  }
}

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
    this.speed = classStats.speed;
    this.maxHealth = classStats.maxHealth;
    this.health = this.maxHealth;
    this.baseDamage = classStats.damage;
    this.bonusDamage = 0;
    this.attackCooldown = classStats.cooldown;
    this.arrowSpeed = classStats.arrowSpeed || 0;
    this.arrowRange = classStats.arrowRange || 0;
    this.arrowPierce = classStats.arrowPierce || 0;
    this.extraSwings = 0;
    this.extraArrows = 0;
    this.bossDamageBonus = 0;
    this.longRangeBonus = 0;
    this.momentumReduction = 0;
    this.momentumDuration = 0;
    this.momentumLeft = 0;
    this.cooldownLeft = 0;
    this.invulnerableLeft = 0;
    this.facing = { x: 1, y: 0 };
    this.walkFrame = 0;
    this.gold = 0;
    this.inventory = {};
    this.upgrades = new Set();
    this.upgradeLevels = {};
    this.masteryLevels = {};
    this.buffs = {};
    for (const chain of Object.keys(CONFIG.upgradeChains[classId] || CONFIG.upgradeChains.warrior)) {
      this.upgradeLevels[chain] = 0;
    }
    for (const chain of Object.keys(CONFIG.masteryChains[classId] || CONFIG.masteryChains.warrior)) {
      this.masteryLevels[chain] = 0;
    }
  }

  get damage() {
    const base = this.baseDamage + this.bonusDamage;
    return Math.round(base * (this.hasBuff("rage") ? CONFIG.powerups.types.rage.damageMultiplier : 1));
  }

  get effectiveAttackCooldown() {
    return Math.max(0.16, this.attackCooldown - (this.momentumLeft > 0 ? this.momentumReduction : 0));
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
    this.health -= amount;
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

  draw(camera) {
    gameSprites.drawPlayer(this, camera);
  }
}

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
    this.speed = (stats.speed + dangerLevel * 4) * (bossStats ? bossStats.speed : 1) * (variantStats ? variantStats.speed : 1);
    this.maxHealth = Math.round(stats.health * (1 + dangerLevel * 0.12) * (bossStats ? bossStats.health : 1) * (variantStats ? variantStats.health : 1));
    this.health = this.maxHealth;
    this.damage = Math.round(stats.damage * (1 + dangerLevel * 0.08) * (bossStats ? bossStats.damage : 1) * (variantStats ? variantStats.damage : 1));
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

class LootItem {
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = 16;
    this.life = 0;
    this.color = {
      "Slime Gel": "#72e782",
      "Goblin Ear": "#b7d276",
      "Wolf Pelt": "#d8d1bd",
      "Rusty Dagger": "#a7aeb9",
      "Monster Fang": "#efe2b4"
    }[name] || "#fff";
  }

  update(dt) {
    this.life += dt;
  }

  draw(camera) {
    if (gameSprites.drawLoot(this, camera)) {
      if (Math.floor(this.life * 4) % 2 === 0) {
        ctx.fillStyle = "#fff6ba";
        ctx.fillRect(Math.floor(this.x - camera.x + 10), Math.floor(this.y - camera.y - 14), 3, 3);
      }
      return;
    }

    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 5) * 2;
    ctx.fillStyle = "rgba(255, 246, 180, 0.28)";
    ctx.fillRect(Math.floor(sx - 10), Math.floor(sy - 10), 20, 20);
    drawRectSprite(sx, sy, this.size, this.size, this.color);
    if (Math.floor(this.life * 4) % 2 === 0) {
      ctx.fillStyle = "#fff6ba";
      ctx.fillRect(Math.floor(sx + 8), Math.floor(sy - 10), 3, 3);
    }
  }
}

class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.data = CONFIG.powerups.types[type] || CONFIG.powerups.types.heart;
    this.name = this.data.name;
    this.x = x;
    this.y = y;
    this.size = 22;
    this.life = 0;
    this.timeLeft = CONFIG.powerups.despawnTime;
    this.color = this.data.color;
  }

  update(dt) {
    this.life += dt;
    this.timeLeft -= dt;
  }

  get expired() {
    return this.timeLeft <= 0;
  }

  collect(game) {
    const player = game.player;
    if (this.type === "heart") {
      const before = player.health;
      player.health = Math.min(player.maxHealth, player.health + CONFIG.powerups.heartHeal);
      const healed = Math.ceil(player.health - before);
      game.floaters.push(new FloatingText(healed > 0 ? `+${healed} Health` : "Health full", player.x, player.y - 34, "#ff9aa5"));
    } else {
      player.addBuff(this.type, this.data.duration);
      game.floaters.push(new FloatingText(this.name, player.x, player.y - 34, this.color));
    }
    game.audio.play("loot");
  }

  draw(camera) {
    if (gameSprites.drawPowerup(this, camera)) {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.globalAlpha = 0.55 + Math.sin(this.life * 8) * 0.18;
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.floor(sx + 11), Math.floor(sy - 18), 3, 3);
      ctx.fillRect(Math.floor(sx - 14), Math.floor(sy + 9), 2, 2);
      ctx.globalAlpha = 1;
      return;
    }

    const sx = this.x - camera.x;
    const sy = this.y - camera.y + Math.sin(this.life * 5.4) * 2;
    ctx.fillStyle = "rgba(255, 246, 180, 0.24)";
    ctx.fillRect(Math.floor(sx - 12), Math.floor(sy - 12), 24, 24);
    drawRectSprite(sx, sy, this.size, this.size, this.color);
  }
}

class TreasureChest {
  constructor(x, y, dangerLevel) {
    this.x = x;
    this.y = y;
    this.size = 34;
    this.dangerLevel = dangerLevel;
    this.life = 0;
    this.opened = false;
  }

  update(dt) {
    this.life += dt;
  }

  nearby(player) {
    return Math.hypot(player.x - this.x, player.y - this.y) < 58;
  }

  open(game) {
    if (this.opened) return;
    this.opened = true;
    const rolls = 3 + Math.min(4, Math.floor(this.dangerLevel / 2)) + Math.floor(Math.random() * 3);
    const table = [
      "Slime Gel",
      "Slime Gel",
      "Goblin Ear",
      "Wolf Pelt",
      "Monster Fang",
      "Rusty Dagger"
    ];
    for (let i = 0; i < rolls; i += 1) {
      const name = table[Math.floor(Math.random() * table.length)];
      game.dropLoot(name, this.x + Math.random() * 54 - 27, this.y + Math.random() * 42 - 21);
    }
    if (Math.random() < 0.3 + this.dangerLevel * 0.03) {
      game.dropLoot("Rusty Dagger", this.x, this.y - 8);
    }
    game.floaters.push(new FloatingText("Treasure!", this.x, this.y - 30, "#ffe18a"));
    game.audio.play("loot");
  }

  draw(camera, showPrompt = false) {
    const sx = this.x - camera.x;
    if (!gameSprites.drawChest(this, camera)) {
      const sy = this.y - camera.y + Math.sin(this.life * 2.4) * 1.5;
      drawRectSprite(sx, sy, this.size, this.size - 8, "#b8793f");
      ctx.fillStyle = "#f3d270";
      ctx.fillRect(Math.floor(sx - 4), Math.floor(sy - 3), 8, 7);
    }
    if (showPrompt) this.drawPrompt(camera);
  }

  drawPrompt(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y - 72 + Math.sin(this.life * 5) * 2;
    ctx.save();
    ctx.font = "700 13px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = "Press E";
    const width = ctx.measureText(text).width + 22;
    ctx.fillStyle = "rgba(25, 14, 7, 0.88)";
    ctx.fillRect(Math.floor(sx - width / 2), Math.floor(sy - 14), width, 28);
    ctx.strokeStyle = "#ffd46b";
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.floor(sx - width / 2), Math.floor(sy - 14), width, 28);
    ctx.fillStyle = "#fff0a6";
    ctx.fillText(text, Math.floor(sx), Math.floor(sy + 1));
    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, direction, damage, speed, range, pierce, longRangeBonus = 0) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.dir = { ...direction };
    this.damage = damage;
    this.speed = speed;
    this.range = range;
    this.pierceLeft = pierce;
    this.longRangeBonus = longRangeBonus;
    this.size = 10;
    this.dead = false;
    this.hitMonsters = new Set();
  }

  update(dt, game) {
    this.x += this.dir.x * this.speed * dt;
    this.y += this.dir.y * this.speed * dt;
    if (Math.hypot(this.x - this.startX, this.y - this.startY) > this.range || this.x < 0 || this.y < 0 || this.x > CONFIG.world.width || this.y > CONFIG.world.height) {
      this.dead = true;
      return;
    }

    for (const monster of game.monsters) {
      if (this.hitMonsters.has(monster)) continue;
      if (Math.hypot(monster.x - this.x, monster.y - this.y) <= monster.size / 2 + this.size / 2) {
        this.hitMonsters.add(monster);
        const traveled = Math.hypot(this.x - this.startX, this.y - this.startY);
        const damage = traveled >= this.range * 0.45 ? Math.round(this.damage * (1 + this.longRangeBonus)) : this.damage;
        monster.takeDamage(damage, this.dir, game);
        game.attackEffects.push({
          x: this.x,
          y: this.y,
          dir: { ...this.dir },
          life: 0.12,
          maxLife: 0.12,
          radius: 22,
          type: "impact"
        });
        if (this.pierceLeft > 0) {
          this.pierceLeft -= 1;
        } else {
          this.dead = true;
        }
        break;
      }
    }
  }

  draw(camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    const angle = Math.atan2(this.dir.y, this.dir.x);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillStyle = "#3b2718";
    ctx.fillRect(-8, -2, 15, 4);
    ctx.fillStyle = "#d9d2c1";
    ctx.fillRect(5, -3, 5, 6);
    ctx.fillStyle = "#f5d279";
    ctx.fillRect(-10, -4, 4, 2);
    ctx.fillRect(-10, 2, 4, 2);
    ctx.restore();
  }
}

class FloatingText {
  constructor(text, x, y, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 0.75;
  }

  update(dt) {
    this.life -= dt;
    this.y -= 34 * dt;
  }

  draw(camera) {
    ctx.globalAlpha = clamp(this.life / 0.75, 0, 1);
    ctx.fillStyle = this.color;
    ctx.font = "bold 16px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    ctx.globalAlpha = 1;
  }
}

class Shopkeeper {
  constructor() {
    this.x = 510;
    this.y = 255;
    this.size = 30;
  }

  nearby(player) {
    return Math.hypot(player.x - this.x, player.y - this.y) < 78;
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
    ctx.fillStyle = "#3c2518";
    ctx.fillRect(Math.floor(sx - 38), Math.floor(sy - 18), 76, 30);
    ctx.strokeStyle = "#d8a452";
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.floor(sx - 38), Math.floor(sy - 18), 76, 30);
    ctx.fillStyle = "#1f130b";
    ctx.fillRect(Math.floor(sx - 30), Math.floor(sy + 13), 60, 5);
    ctx.font = "700 16px Trebuchet MS, Verdana, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffe18a";
    ctx.fillText("SHOP", Math.floor(sx), Math.floor(sy - 2));
    ctx.restore();
  }
}

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
    this.shopOverlay = document.getElementById("shopOverlay");
    this.pauseOverlay = document.getElementById("pauseOverlay");
    this.gameOverOverlay = document.getElementById("gameOverOverlay");
    this.gameOverStats = document.getElementById("gameOverStats");
    this.sellList = document.getElementById("sellList");
    this.buyList = document.getElementById("buyList");
    this.masteryList = document.getElementById("masteryList");
    this.dangerList = document.getElementById("dangerList");
    this.warriorButton = document.getElementById("warriorButton");
    this.rangerButton = document.getElementById("rangerButton");
    this.startRunButton = document.getElementById("startRunButton");
    this.shopTabs = {
      sell: document.getElementById("shopTabSell"),
      buy: document.getElementById("shopTabBuy"),
      mastery: document.getElementById("shopTabMastery"),
      danger: document.getElementById("shopTabDanger")
    };
    this.shopPages = {
      sell: document.getElementById("sellPage"),
      buy: document.getElementById("buyPage"),
      mastery: document.getElementById("masteryPage"),
      danger: document.getElementById("dangerPage")
    };
    this.activeShopTab = "sell";
    this.selectedClassId = "warrior";
    this.inventoryExpanded = false;

    document.getElementById("closeShopButton").addEventListener("click", () => game.closeShop());
    document.getElementById("sellAllButton").addEventListener("click", () => game.shop.sellAll());
    document.getElementById("restartButton").addEventListener("click", () => game.restart());
    this.warriorButton.addEventListener("click", () => this.selectClass("warrior"));
    this.rangerButton.addEventListener("click", () => this.selectClass("ranger"));
    this.startRunButton.addEventListener("click", () => game.startGame(this.selectedClassId));
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

  toggleInventory() {
    this.inventoryExpanded = !this.inventoryExpanded;
    this.update();
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

    const inventory = Object.entries(p.inventory).filter(([, qty]) => qty > 0);
    if (inventory.length) {
      const itemCount = inventory.reduce((total, [, qty]) => total + qty, 0);
      if (this.inventoryExpanded) {
        this.inventoryText.innerHTML = inventory.map(([name, qty]) => {
          const index = gameSprites.lootFrames[name] || 0;
          return `<span class="loot-chip"><span class="loot-icon" style="background-position:-${index * 20}px 0"></span>${name} x${qty}</span>`;
        }).join("");
      } else {
        this.inventoryText.textContent = `Loot ${itemCount} (${inventory.length} types) | Tab`;
      }
    } else {
      this.inventoryText.textContent = "Loot empty | Tab";
    }
    this.inventoryText.classList.toggle("expanded", this.inventoryExpanded);

    if (!this.game.started) {
      this.hintText.textContent = "";
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
    this.shopOverlay.classList.toggle("hidden", !this.game.shopOpen);
    this.shopOverlay.setAttribute("aria-hidden", String(!this.game.shopOpen));
    this.pauseOverlay.classList.toggle("hidden", !this.game.paused || this.game.shopOpen || this.game.gameOver || !this.game.started);
    this.pauseOverlay.setAttribute("aria-hidden", String(!this.game.paused || this.game.shopOpen || this.game.gameOver || !this.game.started));
    this.gameOverOverlay.classList.toggle("hidden", !this.game.gameOver);
    this.gameOverOverlay.setAttribute("aria-hidden", String(!this.game.gameOver));
  }

  renderShop() {
    this.setShopTab(this.activeShopTab);
    const p = this.game.player;
    this.sellList.innerHTML = "";
    for (const [name, value] of Object.entries(CONFIG.lootValues)) {
      const qty = p.inventory[name] || 0;
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = `<div><strong>${name}</strong><small>${qty} owned | ${value} gold each</small></div>`;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Sell";
      button.disabled = qty <= 0;
      button.addEventListener("click", () => this.game.shop.sellItem(name));
      row.appendChild(button);
      this.sellList.appendChild(row);
    }

    this.buyList.innerHTML = "";
    const shopItems = this.game.availableShopItems();
    for (const item of shopItems) {
      const owned = item.type === "upgrade" && item.level > this.game.currentUpgradeChains()[item.chain].length;
      const canAfford = p.gold >= item.price;
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = `<div><strong>${item.name}</strong><small>${item.description} | ${item.price} gold</small></div>`;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = owned ? "Maxed" : "Buy";
      button.disabled = (owned && item.type === "upgrade") || !canAfford;
      button.addEventListener("click", () => this.game.shop.buyItem(item.id));
      row.appendChild(button);
      this.buyList.appendChild(row);
    }

    this.masteryList.innerHTML = "";
    for (const item of this.game.availableMasteryItems()) {
      const canAfford = p.gold >= item.price;
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = `<div><strong>${item.chainName} ${item.currentLevel}/3</strong><small>Next: ${item.name} | ${item.description} | ${item.price} gold</small></div>`;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Train";
      button.disabled = !canAfford;
      button.addEventListener("click", () => this.game.shop.buyMastery(item.id));
      row.appendChild(button);
      this.masteryList.appendChild(row);
    }
    if (!this.masteryList.children.length) {
      const row = document.createElement("div");
      row.className = "shop-row";
      row.innerHTML = "<div><strong>All masteries complete</strong><small>No further mastery training is available.</small></div>";
      this.masteryList.appendChild(row);
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

  showGameOver() {
    this.gameOverStats.textContent = `Day: ${this.game.day} | Kills: ${this.game.kills} | Gold earned: ${this.game.totalGoldEarned} | Stage reached: ${this.game.dangerLevel}`;
  }
}

class Shop {
  constructor(game) {
    this.game = game;
  }

  sellItem(name) {
    const p = this.game.player;
    if (!p.inventory[name]) return;
    p.inventory[name] -= 1;
    p.gold += CONFIG.lootValues[name];
    this.game.totalGoldEarned += CONFIG.lootValues[name];
    this.game.questProgress.gold += CONFIG.lootValues[name];
    this.game.addDangerProgress(Math.max(1, Math.floor(CONFIG.lootValues[name] / CONFIG.dangerProgress.saleGoldDivisor)), "stage progress");
    this.game.audio.play("sell");
    this.game.ui.renderShop();
  }

  sellAll() {
    for (const name of Object.keys(CONFIG.lootValues)) {
      while (this.game.player.inventory[name] > 0) {
        this.sellItem(name);
      }
    }
    this.game.ui.renderShop();
  }

  buyItem(id) {
    const item = this.game.availableShopItems().find((candidate) => candidate.id === id);
    const p = this.game.player;
    if (!item || p.gold < item.price) return;
    if (item.type === "upgrade" && p.upgradeLevels[item.chain] !== item.level - 1) return;

    p.gold -= item.price;
    if (item.type === "upgrade") {
      if (item.damage) p.baseDamage += item.damage;
      if (item.health) {
        p.maxHealth += item.health;
        p.health = p.maxHealth;
      }
      if (item.speed) p.speed += item.speed;
      if (item.bonusDamage) p.bonusDamage += item.bonusDamage;
      if (item.arrowSpeed) p.arrowSpeed += item.arrowSpeed;
      if (item.arrowRange) p.arrowRange += item.arrowRange;
      if (item.arrowPierce) p.arrowPierce += item.arrowPierce;
      if (item.cooldownReduction) p.attackCooldown = Math.max(0.18, p.attackCooldown - item.cooldownReduction);
      p.upgradeLevels[item.chain] = item.level;
      p.upgrades.add(item.id);
    } else if (item.id === "healingPotion") {
      p.health = Math.min(p.maxHealth, p.health + 35);
    }
    this.game.audio.play("buy");
    this.game.ui.renderShop();
  }

  buyMastery(id) {
    const item = this.game.availableMasteryItems().find((candidate) => candidate.id === id);
    const p = this.game.player;
    if (!item || p.gold < item.price) return;
    if (p.masteryLevels[item.chain] !== item.currentLevel) return;

    p.gold -= item.price;
    if (item.extraSwings) p.extraSwings += item.extraSwings;
    if (item.extraArrows) p.extraArrows += item.extraArrows;
    if (item.arrowPierce) p.arrowPierce += item.arrowPierce;
    if (item.longRangeBonus) p.longRangeBonus += item.longRangeBonus;
    if (item.bossDamageBonus) p.bossDamageBonus += item.bossDamageBonus;
    if (item.momentumReduction) p.momentumReduction = item.momentumReduction;
    if (item.momentumDuration) p.momentumDuration = item.momentumDuration;
    p.masteryLevels[item.chain] = item.currentLevel + 1;
    this.game.audio.play("buy");
    this.game.ui.renderShop();
  }
}

class Game {
  constructor() {
    this.audio = new AudioManager();
    this.player = new Player();
    this.shopkeeper = new Shopkeeper();
    this.shop = new Shop(this);
    this.ui = new UI(this);
    this.camera = { x: 0, y: 0 };
    this.lastTime = 0;
    this.started = false;
    this.selectedClass = null;
    this.restart();
    requestAnimationFrame((time) => this.loop(time));
  }

  restart(showStart = true, classId = null) {
    this.player.start(showStart ? "warrior" : (classId || this.selectedClass || "warrior"));
    this.monsters = [];
    this.loot = [];
    this.powerups = [];
    this.chests = [];
    this.projectiles = [];
    this.floaters = [];
    this.attackEffects = [];
    this.spawnTimer = 1;
    this.spawnInterval = 2.7;
    this.chestTimer = this.randomRange(CONFIG.chests.minDelay, CONFIG.chests.maxDelay);
    this.powerupTimer = this.randomRange(CONFIG.powerups.minDelay, CONFIG.powerups.maxDelay);
    this.bossTimer = this.randomRange(CONFIG.bosses.minDelay, CONFIG.bosses.maxDelay);
    this.day = 1;
    this.questProgress = { kills: 0, loot: 0, gold: 0 };
    this.questNotice = "";
    this.questNoticeTime = 0;
    this.dangerLevel = 1;
    this.maxDangerUnlocked = 1;
    this.dangerProgress = 0;
    this.kills = 0;
    this.totalGoldEarned = 0;
    this.selectedClass = showStart ? null : (classId || this.selectedClass || "warrior");
    this.started = !showStart;
    this.paused = showStart;
    this.shopOpen = false;
    this.gameOver = false;
    this.ui.update();
    this.ui.renderShop();
  }

  startGame(classId) {
    if (!CONFIG.classes[classId]) return;
    this.restart(false, classId);
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000 || 0, 0.05);
    this.lastTime = time;
    if (this.started && !this.paused && !this.gameOver) {
      this.update(dt);
    }
    this.draw();
    this.ui.update();
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  update(dt) {
    this.updateCamera();
    mouse.worldX = mouse.x + this.camera.x;
    mouse.worldY = mouse.y + this.camera.y;

    this.player.update(dt, this);
    if (mouse.down) this.player.attack(this);
    for (const monster of this.monsters) monster.update(dt, this);
    for (const projectile of this.projectiles) projectile.update(dt, this);
    this.projectiles = this.projectiles.filter((projectile) => !projectile.dead);
    for (const item of this.loot) item.update(dt);
    for (const powerup of this.powerups) powerup.update(dt);
    this.powerups = this.powerups.filter((powerup) => !powerup.expired);
    for (const chest of this.chests) chest.update(dt);
    for (const floater of this.floaters) floater.update(dt);
    this.floaters = this.floaters.filter((floater) => floater.life > 0);

    for (const effect of this.attackEffects) effect.life -= dt;
    this.attackEffects = this.attackEffects.filter((effect) => effect.life > 0);

    if (!this.playerInTavern()) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnMonsterWave();
        this.spawnTimer = Math.max(0.65, this.spawnInterval - this.dangerLevel * 0.16);
      }
      this.chestTimer -= dt;
      if (this.chestTimer <= 0) {
        this.spawnChest();
        this.chestTimer = this.randomRange(CONFIG.chests.minDelay, CONFIG.chests.maxDelay);
      }
      this.powerupTimer -= dt;
      if (this.powerupTimer <= 0) {
        this.spawnPowerup();
        this.powerupTimer = this.randomRange(CONFIG.powerups.minDelay, CONFIG.powerups.maxDelay);
      }
      this.bossTimer -= dt;
      if (this.bossTimer <= 0) {
        this.spawnBoss();
        this.bossTimer = this.randomRange(CONFIG.bosses.minDelay, CONFIG.bosses.maxDelay);
      }
    }

    if (this.questComplete() && this.playerInTavern()) {
      this.advanceDay();
    }
    this.questNoticeTime = Math.max(0, this.questNoticeTime - dt);
    this.recalculateDanger();
    if (this.player.health <= 0) {
      this.gameOver = true;
      this.paused = false;
      this.shopOpen = false;
      this.audio.play("gameOver");
      this.ui.showGameOver();
    }
  }

  updateCamera() {
    this.camera.x = clamp(this.player.x - canvas.width / 2, 0, CONFIG.world.width - canvas.width);
    this.camera.y = clamp(this.player.y - canvas.height / 2, 0, CONFIG.world.height - canvas.height);
  }

  playerInTavern() {
    return rectContains(CONFIG.tavern, this.player.x, this.player.y);
  }

  pointInPlayableArea(x, y) {
    return rectContains(CONFIG.tavern, x, y)
      || rectContains(CONFIG.transition, x, y)
      || rectContains(CONFIG.field, x, y);
  }

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  dangerProgressGoal() {
    return CONFIG.dangerProgress.baseGoal + (this.maxDangerUnlocked - 1) * CONFIG.dangerProgress.perLevel;
  }

  canEarnDangerProgress() {
    return this.dangerLevel === this.maxDangerUnlocked;
  }

  addDangerProgress(amount, label = "stage progress") {
    if (!this.canEarnDangerProgress() || amount <= 0) return;
    this.dangerProgress += amount;
    let unlocked = false;
    while (this.dangerProgress >= this.dangerProgressGoal()) {
      this.dangerProgress -= this.dangerProgressGoal();
      this.maxDangerUnlocked += 1;
      this.dangerLevel = this.maxDangerUnlocked;
      unlocked = true;
    }
    if (unlocked) {
      this.questNotice = `Stage ${this.maxDangerUnlocked} unlocked.`;
      this.questNoticeTime = 3;
      this.audio.play("day");
    } else if (label) {
      this.questNotice = `+${amount} ${label}.`;
      this.questNoticeTime = 1.5;
    }
  }

  setDangerLevel(level) {
    this.dangerLevel = clamp(level, 1, this.maxDangerUnlocked);
    this.spawnTimer = Math.min(this.spawnTimer, Math.max(0.65, this.spawnInterval - this.dangerLevel * 0.16));
    this.ui.renderShop();
  }

  availableShopItems() {
    const items = [];
    for (const [chain, tiers] of Object.entries(this.currentUpgradeChains())) {
      const level = this.player.upgradeLevels[chain] || 0;
      const next = tiers[level];
      if (next) {
        items.push({
          ...next,
          id: `${chain}${level + 1}`,
          type: "upgrade",
          chain,
          level: level + 1,
          name: `${next.name} (${level + 1}/3)`
        });
      } else {
        items.push({
          id: `${chain}Max`,
          type: "upgrade",
          chain,
          level: tiers.length + 1,
          name: `${chain[0].toUpperCase()}${chain.slice(1)} fully upgraded`,
          price: 0,
          description: "Maximum tier reached"
        });
      }
    }
    return [...items, ...CONFIG.consumables];
  }

  availableMasteryItems() {
    const items = [];
    for (const [chain, data] of Object.entries(this.currentMasteryChains())) {
      const level = this.player.masteryLevels[chain] || 0;
      const next = data.tiers[level];
      if (!next) continue;
      items.push({
        ...next,
        id: `${chain}${level + 1}`,
        type: "mastery",
        chain,
        chainName: data.name,
        currentLevel: level,
        level: level + 1,
        price: CONFIG.masteryPrices[level]
      });
    }
    return items;
  }

  currentUpgradeChains() {
    return CONFIG.upgradeChains[this.player.classId] || CONFIG.upgradeChains.warrior;
  }

  currentMasteryChains() {
    return CONFIG.masteryChains[this.player.classId] || CONFIG.masteryChains.warrior;
  }

  collides(entity, x, y) {
    const rect = entityRect(entity, x, y);
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > CONFIG.world.width || rect.y + rect.height > CONFIG.world.height) {
      return true;
    }
    if (entity === this.player && !this.pointInPlayableArea(x, y)) {
      return true;
    }
    return CONFIG.blockers.some((blocker) => rectsOverlap(rect, blocker));
  }

  moveEntity(entity, dx, dy, bounds = null) {
    const nextX = entity.x + dx;
    if (!this.collides(entity, nextX, entity.y)) entity.x = nextX;
    const nextY = entity.y + dy;
    if (!this.collides(entity, entity.x, nextY)) entity.y = nextY;

    if (bounds) {
      entity.x = clamp(entity.x, bounds.x + entity.size / 2, bounds.x + bounds.width - entity.size / 2);
      entity.y = clamp(entity.y, bounds.y + entity.size / 2, bounds.y + bounds.height - entity.size / 2);
    }
  }

  openShop() {
    if (!this.shopkeeper.nearby(this.player) || !this.playerInTavern()) return;
    this.shopOpen = true;
    this.paused = true;
    this.ui.renderShop();
  }

  interact() {
    if (!this.started) return;
    if (this.shopOpen) return;
    const chest = this.nearbyChest();
    if (chest) {
      chest.open(this);
      this.chests = this.chests.filter((candidate) => candidate !== chest);
      return;
    }
    this.openShop();
  }

  nearbyChest() {
    return this.chests.find((chest) => chest.nearby(this.player));
  }

  closeShop() {
    this.shopOpen = false;
    this.paused = false;
  }

  togglePause() {
    if (!this.started) return;
    if (this.shopOpen) {
      this.closeShop();
      return;
    }
    if (!this.gameOver) this.paused = !this.paused;
  }

  spawnMonsterWave() {
    const maxMonsters = 5 + this.dangerLevel * 2;
    if (this.monsters.length >= maxMonsters) return;
    const count = this.dangerLevel >= 5 && Math.random() < 0.45 ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      const roll = Math.random();
      const type = roll < 0.52 ? "slime" : roll < 0.78 ? "goblin" : "wolf";
      const point = this.randomFieldPoint(CONFIG.monsters[type].size);
      const x = point.x;
      const y = point.y;
      this.monsters.push(new Monster(type, x, y, this.dangerLevel, false, this.rollMonsterVariant(type)));
    }
  }

  eliteVariantChance() {
    if (this.dangerLevel < CONFIG.monsterVariants.eliteStartStage) return 0;
    if (this.dangerLevel < 12) return 0.25;
    if (this.dangerLevel < 15) return 0.5;
    if (this.dangerLevel < 18) return 0.8;
    return 1;
  }

  rollMonsterVariant(type, forceAtHighStage = false) {
    const variant = CONFIG.monsterVariants.types[type];
    if (!variant) return null;
    if (forceAtHighStage && this.dangerLevel >= CONFIG.monsterVariants.eliteStartStage) return variant.id;
    return Math.random() < this.eliteVariantChance() ? variant.id : null;
  }

  randomFieldPoint(size = 32) {
    let x = CONFIG.field.x + 60 + Math.random() * (CONFIG.field.width - 120);
    let y = CONFIG.field.y + 60 + Math.random() * (CONFIG.field.height - 120);
    const probe = { x, y, size };
    for (let attempt = 0; attempt < 16 && this.collides(probe, x, y); attempt += 1) {
      x = CONFIG.field.x + 60 + Math.random() * (CONFIG.field.width - 120);
      y = CONFIG.field.y + 60 + Math.random() * (CONFIG.field.height - 120);
    }
    return { x, y };
  }

  spawnChest() {
    if (this.chests.length >= CONFIG.chests.maxActive) return;
    const point = this.randomFieldPoint(34);
    this.chests.push(new TreasureChest(point.x, point.y, this.dangerLevel));
    this.floaters.push(new FloatingText("Chest appeared", point.x, point.y - 30, "#ffe18a"));
  }

  spawnPowerup(type = null) {
    if (this.powerups.length >= CONFIG.powerups.maxActive) return;
    const point = this.randomFieldPoint(24);
    const selectedType = type || this.randomPowerupType();
    this.powerups.push(new PowerUp(selectedType, point.x, point.y));
  }

  randomPowerupType() {
    const damaged = this.player.health < this.player.maxHealth * 0.65;
    const table = damaged
      ? ["heart", "heart", "rage", "haste", "shield", "cleave"]
      : ["rage", "haste", "shield", "cleave", "heart"];
    return table[Math.floor(Math.random() * table.length)];
  }

  spawnBoss() {
    if (this.monsters.filter((monster) => monster.isBoss).length >= CONFIG.bosses.maxActive) return;
    const types = Object.keys(CONFIG.bosses.types);
    const type = types[Math.floor(Math.random() * types.length)];
    const point = this.randomFieldPoint(CONFIG.bosses.types[type].size);
    const boss = new Monster(type, point.x, point.y, this.dangerLevel, true, this.rollMonsterVariant(type, true));
    this.monsters.push(boss);
    this.floaters.push(new FloatingText(`${boss.name} appears!`, boss.x, boss.y - 44, "#ffcf6b"));
    this.audio.play("day");
  }

  killMonster(monster) {
    this.monsters = this.monsters.filter((candidate) => candidate !== monster);
    this.kills += CONFIG.monsters[monster.type].score * (monster.isBoss ? 5 : 1);
    this.questProgress.kills += monster.isBoss ? 3 : 1;
    if (this.player.momentumDuration > 0) {
      this.player.momentumLeft = this.player.momentumDuration;
    }
    this.addDangerProgress(monster.isBoss ? CONFIG.dangerProgress.bossKill : CONFIG.dangerProgress.normalKill, "stage progress");
    for (const [lootName, chance] of CONFIG.monsters[monster.type].loot) {
      if (Math.random() < chance) {
        this.dropLoot(lootName, monster.x + Math.random() * 24 - 12, monster.y + Math.random() * 24 - 12);
      }
    }
    if (Math.random() < 0.08 + this.dangerLevel * 0.01) {
      this.dropLoot("Monster Fang", monster.x, monster.y);
    }
    if (monster.variantData) {
      for (const [lootName, chance] of monster.variantData.extraLoot) {
        if (Math.random() < chance) {
          this.dropLoot(lootName, monster.x + Math.random() * 30 - 15, monster.y + Math.random() * 30 - 15);
        }
      }
      if (Math.random() < monster.variantData.bonusLootChance || monster.isBoss) {
        this.dropLoot("Monster Fang", monster.x + Math.random() * 36 - 18, monster.y + Math.random() * 32 - 16);
      }
    }
    if (monster.isBoss) {
      const bossDrops = 5 + Math.min(5, this.dangerLevel);
      const table = {
        slime: ["Slime Gel", "Slime Gel", "Monster Fang", "Rusty Dagger"],
        goblin: ["Goblin Ear", "Goblin Ear", "Rusty Dagger", "Monster Fang"],
        wolf: ["Wolf Pelt", "Wolf Pelt", "Monster Fang", "Rusty Dagger"]
      }[monster.type];
      for (let i = 0; i < bossDrops; i += 1) {
        this.dropLoot(table[Math.floor(Math.random() * table.length)], monster.x + Math.random() * 70 - 35, monster.y + Math.random() * 56 - 28);
      }
      this.floaters.push(new FloatingText("Boss defeated!", monster.x, monster.y - 42, "#ffe18a"));
    }
  }

  dropLoot(name, x, y) {
    this.loot.push(new LootItem(name, x, y));
  }

  collectNearbyLoot() {
    for (const item of [...this.loot]) {
      if (distance(this.player, item) < 30) {
        this.player.addLoot(item.name);
        this.questProgress.loot += 1;
        this.audio.play("loot");
        this.loot = this.loot.filter((candidate) => candidate !== item);
        this.floaters.push(new FloatingText(item.name, this.player.x, this.player.y - 30, "#ffe18a"));
      }
    }
  }

  collectNearbyPowerups() {
    for (const powerup of [...this.powerups]) {
      if (distance(this.player, powerup) < 34) {
        powerup.collect(this);
        this.powerups = this.powerups.filter((candidate) => candidate !== powerup);
      }
    }
  }

  recalculateDanger() {
    this.dangerLevel = clamp(this.dangerLevel, 1, this.maxDangerUnlocked);
  }

  currentQuest() {
    return CONFIG.quests[(this.day - 1) % CONFIG.quests.length];
  }

  questComplete() {
    const quest = this.currentQuest();
    return (!quest.kills || this.questProgress.kills >= quest.kills)
      && (!quest.loot || this.questProgress.loot >= quest.loot)
      && (!quest.gold || this.questProgress.gold >= quest.gold);
  }

  questSummary() {
    const quest = this.currentQuest();
    if (this.questNoticeTime > 0) return this.questNotice;
    if (this.questComplete()) return `Quest complete: return to the tavern for ${quest.reward} bonus gold.`;
    const parts = [];
    if (quest.kills) parts.push(`${this.questProgress.kills}/${quest.kills} hunts`);
    if (quest.loot) parts.push(`${this.questProgress.loot}/${quest.loot} loot`);
    if (quest.gold) parts.push(`${this.questProgress.gold}/${quest.gold} sale gold`);
    return `Quest: ${quest.goal} (${parts.join(", ")})`;
  }

  advanceDay() {
    const quest = this.currentQuest();
    this.player.gold += quest.reward;
    this.totalGoldEarned += quest.reward;
    this.day += 1;
    this.questProgress = { kills: 0, loot: 0, gold: 0 };
    this.questNotice = `Day ${this.day - 1} complete: +${quest.reward} bonus gold. Day ${this.day} begins.`;
    this.questNoticeTime = 4;
    this.player.health = Math.min(this.player.maxHealth, this.player.health + 35);
    this.monsters = this.monsters.filter((monster) => distance(monster, this.player) > 420);
    this.audio.play("day");
    this.addDangerProgress(CONFIG.dangerProgress.questComplete, "stage progress");
  }

  draw() {
    this.updateCamera();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawWorld();
    for (const item of this.loot) item.draw(this.camera);
    for (const powerup of this.powerups) powerup.draw(this.camera);
    const promptedChest = this.nearbyChest();
    for (const chest of this.chests) chest.draw(this.camera, chest === promptedChest);
    for (const projectile of this.projectiles) projectile.draw(this.camera);
    for (const monster of this.monsters) monster.draw(this.camera);
    this.shopkeeper.draw(this.camera);
    this.player.draw(this.camera);
    this.drawAttackEffects();
    for (const floater of this.floaters) floater.draw(this.camera);
  }

  drawWorld() {
    ctx.fillStyle = "#2e6b35";
    ctx.fillRect(-this.camera.x, -this.camera.y, CONFIG.world.width, CONFIG.world.height);

    this.drawField();
    this.drawTavern();
    this.drawScenery();
  }

  drawTavern() {
    const t = CONFIG.tavern;
    const x = t.x - this.camera.x;
    const y = t.y - this.camera.y;
    ctx.fillStyle = "#68401f";
    ctx.fillRect(x, y, t.width, t.height);
    gameSprites.drawTiledArea("tavernFloor", t, this.camera, 32);
    ctx.fillStyle = "#7f512b";
    for (let row = 0; row < t.height; row += 32) {
      ctx.fillRect(x, y + row, t.width, 4);
    }
    ctx.fillStyle = "#3c2518";
    ctx.fillRect(x + 24, y + 92, 230, 44);
    ctx.fillStyle = "#a56f35";
    ctx.fillRect(x + 28, y + 96, 222, 15);
    ctx.fillStyle = "#2c1b13";
    ctx.fillRect(x - 15, y - 18, t.width + 30, 18);
    ctx.fillRect(x - 15, y + t.height, t.width + 30, 18);
    ctx.fillRect(x - 18, y - 18, 18, t.height + 36);
    ctx.fillRect(x + t.width, y - 18, 18, 148);
    ctx.fillRect(x + t.width, y + 232, 18, 146);
    for (let wallX = t.x - 32; wallX < t.x + t.width + 32; wallX += 32) {
      gameSprites.drawTile("wall", wallX - this.camera.x, t.y - 32 - this.camera.y);
      gameSprites.drawTile("wall", wallX - this.camera.x, t.y + t.height - this.camera.y);
    }
    for (let wallY = t.y - 32; wallY < t.y + t.height + 32; wallY += 32) {
      gameSprites.drawTile("wall", t.x - 32 - this.camera.x, wallY - this.camera.y);
    }
    for (let wallY = t.y - 32; wallY < t.y + 150; wallY += 32) {
      gameSprites.drawTile("wall", t.x + t.width - this.camera.x, wallY - this.camera.y);
    }
    for (let wallY = t.y + 232; wallY < t.y + t.height + 32; wallY += 32) {
      gameSprites.drawTile("wall", t.x + t.width - this.camera.x, wallY - this.camera.y);
    }
    ctx.fillStyle = "#f1b14e";
    ctx.fillRect(x + 300, y + 34, 48, 48);
    ctx.fillStyle = "#58331f";
    ctx.fillRect(CONFIG.door.x - this.camera.x, CONFIG.door.y - this.camera.y, CONFIG.door.width, CONFIG.door.height);
    ctx.fillStyle = "#d8a452";
    ctx.fillRect(CONFIG.door.x - this.camera.x + 7, CONFIG.door.y - this.camera.y + 8, CONFIG.door.width - 14, CONFIG.door.height - 16);
    gameSprites.drawTile("door", CONFIG.door.x - this.camera.x, CONFIG.door.y - this.camera.y, 48);
    gameSprites.drawTile("counter", x + 24, y + 88, 64);
  }

  drawField() {
    const f = CONFIG.field;
    ctx.fillStyle = "#367a3b";
    ctx.fillRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);
    gameSprites.drawTiledArea("grass", f, this.camera, 32, "grassFlowers");
    ctx.strokeStyle = "rgba(13, 42, 21, 0.45)";
    ctx.lineWidth = 6;
    ctx.strokeRect(f.x - this.camera.x, f.y - this.camera.y, f.width, f.height);

    ctx.fillStyle = "#224925";
    for (let x = f.x + 40; x < f.x + f.width; x += 86) {
      for (let y = f.y + 40; y < f.y + f.height; y += 72) {
        if ((x + y) % 3 === 0) ctx.fillRect(x - this.camera.x, y - this.camera.y, 10, 6);
      }
    }

    ctx.fillStyle = "#8b8b7a";
    for (const rock of CONFIG.scenery.rocks) {
      ctx.fillRect(rock[0] - this.camera.x, rock[1] - this.camera.y, 32, 22);
      ctx.fillStyle = "#b2b09a";
      ctx.fillRect(rock[0] - this.camera.x + 6, rock[1] - this.camera.y + 3, 12, 5);
      ctx.fillStyle = "#8b8b7a";
      gameSprites.drawTile("rock", rock[0] - this.camera.x, rock[1] - this.camera.y - 5);
    }
  }

  drawScenery() {
    const trees = CONFIG.scenery.trees;
    for (const [x, y] of trees) {
      ctx.fillStyle = "#52321f";
      ctx.fillRect(x - this.camera.x + 12, y - this.camera.y + 30, 14, 30);
      ctx.fillStyle = "#1f5b32";
      ctx.fillRect(x - this.camera.x, y - this.camera.y, 42, 42);
      ctx.fillStyle = "#2d7441";
      ctx.fillRect(x - this.camera.x + 8, y - this.camera.y - 8, 28, 28);
      gameSprites.drawTile("tree", x - this.camera.x, y - this.camera.y, 64);
    }

    ctx.fillStyle = "rgba(255, 203, 91, 0.16)";
    ctx.fillRect(CONFIG.door.x - this.camera.x + 12, CONFIG.door.y - this.camera.y + 78, 24, 76);
  }

  drawAttackEffects() {
    for (const effect of this.attackEffects) {
      const alpha = effect.life / effect.maxLife;
      ctx.globalAlpha = alpha;
      const px = (effect.type === "impact" || effect.type === "ranged" ? effect.x : this.player.x) - this.camera.x;
      const py = (effect.type === "impact" || effect.type === "ranged" ? effect.y : this.player.y) - this.camera.y;
      const angle = Math.atan2(effect.dir.y, effect.dir.x);
      ctx.fillStyle = effect.type === "impact" ? "rgba(255, 246, 186, 0.7)" : "rgba(255, 230, 161, 0.58)";
      ctx.strokeStyle = effect.type === "impact" ? "#f5d279" : "#fff1a8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (effect.type === "impact") {
        ctx.arc(px, py, effect.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === "ranged") {
        ctx.moveTo(px - effect.dir.x * 8, py - effect.dir.y * 8);
        ctx.lineTo(px + effect.dir.x * effect.radius, py + effect.dir.y * effect.radius);
        ctx.stroke();
      } else {
        ctx.moveTo(px, py);
        ctx.arc(px, py, effect.radius, angle - 0.72, angle + 0.72);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }
}

const gameSprites = new SpriteSheet();
const game = new Game();

window.addEventListener("keydown", (event) => {
  game.audio.unlock();
  const key = movementKey(event);
  keys.add(key);
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    event.preventDefault();
  }
  if (key === "tab") {
    event.preventDefault();
    if (game.started && !event.repeat) game.ui.toggleInventory();
  }
  if (key === " " && !game.shopOpen) game.player.attack(game);
  if (key === "e") game.interact();
  if (key === "escape") game.togglePause();
  if (key === "r" && game.gameOver) game.restart();
  if (key === "enter" && !game.started) game.startGame(game.ui.selectedClassId);
});

window.addEventListener("keyup", (event) => {
  keys.delete(movementKey(event));
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouse.x = (event.clientX - rect.left) * scaleX;
  mouse.y = (event.clientY - rect.top) * scaleY;
});

canvas.addEventListener("mousedown", (event) => {
  game.audio.unlock();
  if (event.button === 0) {
    mouse.down = true;
    game.player.attack(game);
  }
});

window.addEventListener("mouseup", () => {
  mouse.down = false;
});

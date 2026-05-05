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


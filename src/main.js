const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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


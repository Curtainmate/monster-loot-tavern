class TavernLayoutEditor {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.selected = null;
    this.dragging = false;
    this.panelDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.panelDragOffset = { x: 0, y: 0 };
    this.savedPause = false;
    this.grid = 8;
    this.storageKey = "monsterLootTavern.tavernLayoutDraft";
    this.panel = document.getElementById("layoutEditorPanel");
    this.status = document.getElementById("layoutEditorStatus");
    this.exportText = document.getElementById("layoutExportText");
    this.panel.querySelector("header").addEventListener("mousedown", (event) => this.startPanelDrag(event));
    window.addEventListener("mousemove", (event) => this.dragPanel(event));
    window.addEventListener("mouseup", () => this.stopPanelDrag());
    document.getElementById("layoutExportButton").addEventListener("click", () => this.exportLayout());
    document.getElementById("layoutResetButton").addEventListener("click", () => this.resetDraft());
    this.loadDraft();
  }

  toggle() {
    if (!this.game.started) return;
    this.active = !this.active;
    if (this.active) {
      this.savedPause = this.game.paused;
      this.game.closeShop();
      this.game.closeInventory();
      this.game.paused = true;
      keys.clear();
    } else {
      this.dragging = false;
      this.panelDragging = false;
      this.game.paused = this.savedPause;
    }
    this.panel.classList.toggle("hidden", !this.active);
    this.panel.setAttribute("aria-hidden", String(!this.active));
    this.updatePanel();
  }

  props() {
    const tavern = CONFIG.scenery.tavern;
    return [
      ...tavern.floorProps.map((prop, index) => ({ layer: "floorProps", index, prop })),
      ...tavern.backProps.map((prop, index) => ({ layer: "backProps", index, prop })),
      ...tavern.frontProps.map((prop, index) => ({ layer: "frontProps", index, prop }))
    ];
  }

  pick(worldX, worldY) {
    return [...this.props()].reverse().find(({ prop }) => {
      return worldX >= prop.x && worldX <= prop.x + prop.width
        && worldY >= prop.y && worldY <= prop.y + prop.height;
    }) || null;
  }

  mouseDown() {
    if (!this.active) return false;
    if (this.pointerInsidePanel()) return false;
    const picked = this.pick(mouse.worldX, mouse.worldY);
    this.selected = picked;
    this.dragging = Boolean(picked);
    if (picked) {
      this.dragOffset.x = mouse.worldX - picked.prop.x;
      this.dragOffset.y = mouse.worldY - picked.prop.y;
    }
    this.updatePanel();
    return true;
  }

  mouseMove() {
    if (!this.active || !this.dragging || !this.selected) return false;
    if (this.pointerInsidePanel()) return false;
    const prop = this.selected.prop;
    prop.x = this.snap(mouse.worldX - this.dragOffset.x);
    prop.y = this.snap(mouse.worldY - this.dragOffset.y);
    this.saveDraft();
    this.updatePanel();
    return true;
  }

  mouseUp() {
    if (!this.active) return false;
    this.dragging = false;
    return true;
  }

  pointerInsidePanel() {
    const rect = this.panel.getBoundingClientRect();
    const shellRect = document.querySelector(".game-shell").getBoundingClientRect();
    const clientX = shellRect.left + (mouse.x / canvas.width) * shellRect.width;
    const clientY = shellRect.top + (mouse.y / canvas.height) * shellRect.height;
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  startPanelDrag(event) {
    if (!this.active) return;
    const rect = this.panel.getBoundingClientRect();
    this.panelDragging = true;
    this.panelDragOffset.x = event.clientX - rect.left;
    this.panelDragOffset.y = event.clientY - rect.top;
    event.preventDefault();
  }

  dragPanel(event) {
    if (!this.panelDragging) return;
    const shell = document.querySelector(".game-shell").getBoundingClientRect();
    const panel = this.panel.getBoundingClientRect();
    const left = clamp(event.clientX - shell.left - this.panelDragOffset.x, 8, shell.width - panel.width - 8);
    const top = clamp(event.clientY - shell.top - this.panelDragOffset.y, 8, shell.height - panel.height - 8);
    this.panel.style.left = `${left}px`;
    this.panel.style.top = `${top}px`;
    this.panel.style.right = "auto";
    this.panel.style.bottom = "auto";
  }

  stopPanelDrag() {
    this.panelDragging = false;
  }

  keyDown(event, key) {
    if (key === "l" && !event.repeat) {
      this.toggle();
      return true;
    }
    if (!this.active) return false;
    if (key === "escape") {
      this.toggle();
      return true;
    }
    if (key === "c") {
      this.exportLayout();
      return true;
    }
    if (!this.selected) return true;
    const step = event.shiftKey ? 1 : this.grid;
    const move = {
      arrowleft: [-step, 0],
      arrowright: [step, 0],
      arrowup: [0, -step],
      arrowdown: [0, step]
    }[key];
    if (move) {
      this.selected.prop.x += move[0];
      this.selected.prop.y += move[1];
      this.saveDraft();
      this.updatePanel();
    }
    return true;
  }

  snap(value) {
    return Math.round(value / this.grid) * this.grid;
  }

  updatePanel() {
    if (!this.status || !this.exportText) return;
    if (!this.selected) {
      this.status.textContent = "No prop selected";
    } else {
      const prop = this.selected.prop;
      this.status.textContent = `${prop.image} | ${this.selected.layer} | x ${prop.x}, y ${prop.y}`;
    }
  }

  layoutData() {
    const tavern = CONFIG.scenery.tavern;
    return {
      floorProps: tavern.floorProps.map((prop) => ({ ...prop })),
      backProps: tavern.backProps.map((prop) => ({ ...prop })),
      frontProps: tavern.frontProps.map((prop) => ({ ...prop }))
    };
  }

  exportLayout() {
    const text = JSON.stringify(this.layoutData(), null, 2);
    this.exportText.value = text;
    this.exportText.select();
    navigator.clipboard?.writeText(text).catch(() => {});
    this.status.textContent = "Layout copied/exported";
  }

  saveDraft() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.layoutData()));
  }

  loadDraft() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      for (const layer of ["floorProps", "backProps", "frontProps"]) {
        if (Array.isArray(draft[layer])) {
          CONFIG.scenery.tavern[layer].splice(0, CONFIG.scenery.tavern[layer].length, ...draft[layer]);
        }
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  resetDraft() {
    localStorage.removeItem(this.storageKey);
    this.exportText.value = "Draft cleared. Refresh the page to restore config defaults.";
    this.status.textContent = "Draft cleared";
  }

  draw() {
    if (!this.active) return;
    ctx.save();
    ctx.font = "700 12px Trebuchet MS, Verdana, sans-serif";
    ctx.textBaseline = "top";
    for (const item of this.props()) {
      const prop = item.prop;
      const sx = prop.x - this.game.camera.x;
      const sy = prop.y - this.game.camera.y;
      const selected = this.selected && item.prop === this.selected.prop;
      ctx.strokeStyle = selected ? "#ffe18a" : "rgba(255, 225, 138, 0.55)";
      ctx.lineWidth = selected ? 3 : 1;
      ctx.strokeRect(Math.floor(sx), Math.floor(sy), prop.width, prop.height);
      ctx.fillStyle = "rgba(20, 12, 7, 0.78)";
      ctx.fillRect(Math.floor(sx), Math.floor(sy - 18), Math.min(150, prop.image.length * 7 + 12), 17);
      ctx.fillStyle = selected ? "#ffe18a" : "#f5deb0";
      ctx.fillText(prop.image, Math.floor(sx + 5), Math.floor(sy - 16));
    }
    ctx.restore();
  }
}

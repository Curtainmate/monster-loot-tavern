class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.music = new Audio("assets/audio/music/journey_theme.mp3");
    this.music.loop = true;
    this.music.volume = 0.34;
    this.musicEnabled = false;
    this.samples = {
      bowShot: "assets/audio/sfx/bow_shot.mp3",
      swordSwing: "assets/audio/sfx/sword_swoosh.mp3"
    };
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
      bowShot: () => this.playSample("bowShot", 0.42),
      swordSwing: () => this.playSample("swordSwing", 0.42),
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

  playSample(name, volume = 0.5) {
    const src = this.samples[name];
    if (!src) return;
    const sound = new Audio(src);
    sound.volume = volume;
    sound.play().catch(() => {
      this.tone(330, 0.06, "square", 0.035);
    });
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.music.play().catch(() => {
        this.musicEnabled = false;
      });
    } else {
      this.music.pause();
    }
    return this.musicEnabled;
  }

  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
    this.musicEnabled = false;
  }
}


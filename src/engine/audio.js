// Audio system using Web Audio API for chiptune-style sounds
const Audio = {
    ctx: null,
    masterVolume: 0.3,
    musicVolume: 0.2,
    sfxVolume: 0.4,
    currentMusic: null,
    musicNodes: [],
    enabled: true,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Resume on user interaction
            document.addEventListener('keydown', () => {
                if (this.ctx.state === 'suspended') this.ctx.resume();
            }, { once: true });
        } catch (e) {
            this.enabled = false;
        }
    },

    // Play a note
    playNote(freq, duration, type = 'square', volume = 0.3, delay = 0) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(volume * this.sfxVolume, this.ctx.currentTime + delay + 0.01);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration + 0.1);
        return osc;
    },

    // Sound effects
    playSfx(name) {
        if (!this.enabled) return;
        switch (name) {
            case 'select':
                this.playNote(800, 0.08, 'square', 0.2);
                break;
            case 'confirm':
                this.playNote(600, 0.08, 'square', 0.2);
                this.playNote(900, 0.12, 'square', 0.2, 0.08);
                break;
            case 'cancel':
                this.playNote(400, 0.08, 'square', 0.15);
                this.playNote(300, 0.1, 'square', 0.15, 0.08);
                break;
            case 'bump':
                this.playNote(150, 0.06, 'square', 0.15);
                break;
            case 'hit':
                this.playNote(200, 0.05, 'sawtooth', 0.3);
                this.playNote(100, 0.1, 'sawtooth', 0.2, 0.05);
                break;
            case 'critical':
                this.playNote(300, 0.05, 'sawtooth', 0.3);
                this.playNote(150, 0.15, 'sawtooth', 0.25, 0.05);
                break;
            case 'not_effective':
                this.playNote(200, 0.15, 'triangle', 0.15);
                break;
            case 'super_effective':
                this.playNote(400, 0.08, 'square', 0.3);
                this.playNote(600, 0.08, 'square', 0.3, 0.08);
                this.playNote(800, 0.12, 'square', 0.3, 0.16);
                break;
            case 'level_up':
                [523, 659, 784, 1047].forEach((f, i) => {
                    this.playNote(f, 0.15, 'square', 0.25, i * 0.12);
                });
                break;
            case 'heal':
                [400, 500, 600, 700, 800].forEach((f, i) => {
                    this.playNote(f, 0.12, 'sine', 0.2, i * 0.1);
                });
                break;
            case 'catch':
                this.playNote(300, 0.1, 'square', 0.2);
                this.playNote(400, 0.1, 'square', 0.2, 0.15);
                this.playNote(500, 0.1, 'square', 0.2, 0.30);
                break;
            case 'catch_success':
                [523, 659, 784, 1047, 1319].forEach((f, i) => {
                    this.playNote(f, 0.15, 'square', 0.3, i * 0.1);
                });
                break;
            case 'faint':
                [600, 500, 400, 300, 200].forEach((f, i) => {
                    this.playNote(f, 0.15, 'square', 0.2, i * 0.12);
                });
                break;
            case 'run':
                this.playNote(800, 0.05, 'square', 0.2);
                this.playNote(600, 0.05, 'square', 0.2, 0.06);
                this.playNote(400, 0.08, 'square', 0.2, 0.12);
                break;
            case 'encounter':
                [523, 0, 523, 659, 784, 1047].forEach((f, i) => {
                    if (f > 0) this.playNote(f, 0.12, 'square', 0.3, i * 0.1);
                });
                break;
            case 'door':
                this.playNote(500, 0.1, 'sine', 0.15);
                this.playNote(700, 0.15, 'sine', 0.15, 0.1);
                break;
            case 'purchase':
                this.playNote(800, 0.08, 'square', 0.2);
                this.playNote(1000, 0.08, 'square', 0.2, 0.08);
                this.playNote(1200, 0.12, 'square', 0.2, 0.16);
                break;
            case 'save':
                [400, 500, 600, 800].forEach((f, i) => {
                    this.playNote(f, 0.1, 'sine', 0.2, i * 0.08);
                });
                break;
            case 'pokeball_throw':
                this.playNote(600, 0.06, 'square', 0.2);
                this.playNote(800, 0.06, 'square', 0.2, 0.06);
                this.playNote(500, 0.15, 'square', 0.15, 0.12);
                break;
            case 'pokeball_shake':
                this.playNote(300, 0.1, 'triangle', 0.2);
                this.playNote(350, 0.1, 'triangle', 0.15, 0.15);
                break;
            case 'evolution':
                for (let i = 0; i < 8; i++) {
                    this.playNote(400 + i * 100, 0.2, 'sine', 0.25, i * 0.18);
                }
                break;
            case 'text':
                this.playNote(800, 0.03, 'square', 0.08);
                break;
        }
    },

    // Simple music loops
    playMusic(name) {
        this.stopMusic();
        if (!this.enabled || !this.ctx) return;
        this.currentMusic = name;
        this._playMusicLoop(name);
    },

    _playMusicLoop(name) {
        if (!this.enabled || this.currentMusic !== name) return;

        const patterns = {
            title: {
                notes: [
                    [523, 0.2], [659, 0.2], [784, 0.2], [1047, 0.4],
                    [784, 0.2], [659, 0.2], [523, 0.4],
                    [440, 0.2], [523, 0.2], [659, 0.2], [784, 0.4],
                    [659, 0.2], [523, 0.2], [440, 0.4]
                ],
                type: 'square',
                volume: 0.15
            },
            overworld: {
                notes: [
                    [392, 0.15], [440, 0.15], [523, 0.15], [440, 0.15],
                    [392, 0.15], [330, 0.15], [392, 0.3],
                    [440, 0.15], [523, 0.15], [587, 0.15], [523, 0.15],
                    [440, 0.15], [392, 0.15], [440, 0.3]
                ],
                type: 'square',
                volume: 0.1
            },
            battle: {
                notes: [
                    [330, 0.1], [330, 0.1], [392, 0.1], [330, 0.1],
                    [294, 0.1], [330, 0.2], [247, 0.1],
                    [330, 0.1], [330, 0.1], [392, 0.1], [440, 0.1],
                    [392, 0.1], [330, 0.2], [294, 0.1]
                ],
                type: 'square',
                volume: 0.12
            },
            pokemon_center: {
                notes: [
                    [523, 0.2], [587, 0.2], [659, 0.2], [698, 0.2],
                    [784, 0.4], [659, 0.2], [523, 0.2],
                    [587, 0.2], [523, 0.2], [440, 0.2], [523, 0.4]
                ],
                type: 'sine',
                volume: 0.12
            },
            victory: {
                notes: [
                    [523, 0.15], [523, 0.15], [523, 0.15], [523, 0.3],
                    [415, 0.3], [466, 0.3], [523, 0.15], [466, 0.15],
                    [523, 0.6]
                ],
                type: 'square',
                volume: 0.15
            },
            trainer_battle: {
                notes: [
                    [440, 0.1], [440, 0.1], [523, 0.1], [440, 0.1],
                    [392, 0.1], [440, 0.1], [523, 0.1], [587, 0.1],
                    [523, 0.1], [440, 0.1], [392, 0.1], [440, 0.2],
                    [330, 0.1], [392, 0.1], [440, 0.2]
                ],
                type: 'square',
                volume: 0.12
            }
        };

        const pattern = patterns[name];
        if (!pattern) return;

        let time = 0;
        pattern.notes.forEach(([freq, dur]) => {
            if (freq > 0) {
                this.playNote(freq, dur * 0.9, pattern.type, pattern.volume * this.musicVolume / this.sfxVolume, time);
            }
            time += dur;
        });

        // Loop
        setTimeout(() => {
            if (this.currentMusic === name) {
                this._playMusicLoop(name);
            }
        }, time * 1000);
    },

    stopMusic() {
        this.currentMusic = null;
    }
};

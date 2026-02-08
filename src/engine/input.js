// Input handling
const Input = {
    keys: {},
    justPressed: {},
    justReleased: {},
    _prevKeys: {},

    init() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            this.keys[e.code] = false;
        });

        // Touch controls for mobile
        this._setupTouchControls();
    },

    update() {
        for (const key in this.keys) {
            this.justPressed[key] = this.keys[key] && !this._prevKeys[key];
            this.justReleased[key] = !this.keys[key] && this._prevKeys[key];
        }
        this._prevKeys = { ...this.keys };
    },

    isDown(key) {
        return !!this.keys[key];
    },

    isJustPressed(key) {
        return !!this.justPressed[key];
    },

    // Convenience methods
    get up() { return this.isDown('ArrowUp') || this.isDown('KeyW'); },
    get down() { return this.isDown('ArrowDown') || this.isDown('KeyS'); },
    get left() { return this.isDown('ArrowLeft') || this.isDown('KeyA'); },
    get right() { return this.isDown('ArrowRight') || this.isDown('KeyD'); },
    get confirm() { return this.isJustPressed('KeyZ') || this.isJustPressed('Enter'); },
    get cancel() { return this.isJustPressed('KeyX') || this.isJustPressed('Backspace'); },
    get start() { return this.isJustPressed('Enter') || this.isJustPressed('Escape'); },
    get run() { return this.isDown('Space') || this.isDown('ShiftLeft'); },

    get upPressed() { return this.isJustPressed('ArrowUp') || this.isJustPressed('KeyW'); },
    get downPressed() { return this.isJustPressed('ArrowDown') || this.isJustPressed('KeyS'); },
    get leftPressed() { return this.isJustPressed('ArrowLeft') || this.isJustPressed('KeyA'); },
    get rightPressed() { return this.isJustPressed('ArrowRight') || this.isJustPressed('KeyD'); },

    _setupTouchControls() {
        // Virtual D-pad and buttons for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        window.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < 10 && absDy < 10) {
                // Tap = confirm
                this.keys['KeyZ'] = true;
                setTimeout(() => { this.keys['KeyZ'] = false; }, 100);
            } else if (absDx > absDy) {
                if (dx > 0) {
                    this.keys['ArrowRight'] = true;
                    setTimeout(() => { this.keys['ArrowRight'] = false; }, 100);
                } else {
                    this.keys['ArrowLeft'] = true;
                    setTimeout(() => { this.keys['ArrowLeft'] = false; }, 100);
                }
            } else {
                if (dy > 0) {
                    this.keys['ArrowDown'] = true;
                    setTimeout(() => { this.keys['ArrowDown'] = false; }, 100);
                } else {
                    this.keys['ArrowUp'] = true;
                    setTimeout(() => { this.keys['ArrowUp'] = false; }, 100);
                }
            }
        });
    }
};

// Title screen
const TitleScreen = {
    active: true,
    selectedIndex: 0,
    animTimer: 0,
    phase: 0,
    options: [],

    init() {
        this.active = true;
        this.selectedIndex = 0;
        this.animTimer = 0;
        this.phase = 0;
        this.options = SaveSystem.hasSave() ?
            ['CONTINUE', 'NEW GAME'] :
            ['NEW GAME'];
        Audio.playMusic('title');
    },

    update() {
        if (!this.active) return null;
        this.animTimer++;

        if (this.phase === 0) {
            // Press any key to continue
            if (Input.confirm || Input.start) {
                this.phase = 1;
                Audio.playSfx('confirm');
            }
            return null;
        }

        if (Input.downPressed) {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
            Audio.playSfx('select');
        }

        if (Input.confirm) {
            Audio.playSfx('confirm');
            const option = this.options[this.selectedIndex];
            if (option === 'CONTINUE') {
                return 'continue';
            } else if (option === 'NEW GAME') {
                return 'new_game';
            }
        }

        return null;
    },

    draw(ctx) {
        if (!this.active) return;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#2040a0');
        gradient.addColorStop(0.5, '#4080e0');
        gradient.addColorStop(1, '#80c0f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Stars
        for (let i = 0; i < 30; i++) {
            const sx = ((i * 73 + this.animTimer * 0.2) % CANVAS_WIDTH);
            const sy = ((i * 137) % (CANVAS_HEIGHT * 0.6));
            const size = (Math.sin(this.animTimer * 0.05 + i) + 1) * SCALE;
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx, sy, size, size);
        }

        // Title text with shadow
        const titleY = 30 * SCALE + Math.sin(this.animTimer * 0.03) * 5 * SCALE;
        ctx.fillStyle = '#000';
        SpriteRenderer.drawText(ctx, 'POKEMON', CANVAS_WIDTH / 2 - 52 * SCALE + 2, titleY + 2, 16 * SCALE, '#000');
        SpriteRenderer.drawText(ctx, 'POKEMON', CANVAS_WIDTH / 2 - 52 * SCALE, titleY, 16 * SCALE, '#f8d030');

        // Subtitle
        SpriteRenderer.drawText(ctx, 'CLONE EDITION', CANVAS_WIDTH / 2 - 40 * SCALE, titleY + 20 * SCALE, 8 * SCALE, '#fff');

        // Pokemon sprite showcase
        const showcaseY = CANVAS_HEIGHT * 0.35;
        const pokemonIds = ['charizard', 'venusaur', 'blastoise'];
        pokemonIds.forEach((id, i) => {
            const px = CANVAS_WIDTH / 2 + (i - 1) * 55 * SCALE - 8 * SCALE;
            const py = showcaseY + Math.sin(this.animTimer * 0.04 + i * 2) * 5 * SCALE;
            const spriteData = PokemonSprites.getSprite(id, 'front');
            SpriteRenderer.draw(ctx, spriteData.sprite, px, py, SCALE * 2.5, spriteData.palette);
        });

        if (this.phase === 0) {
            // Press Start
            if (Math.floor(this.animTimer / 30) % 2 === 0) {
                SpriteRenderer.drawText(ctx, 'PRESS Z OR ENTER',
                    CANVAS_WIDTH / 2 - 55 * SCALE, CANVAS_HEIGHT - 30 * SCALE, 8 * SCALE, '#fff');
            }
        } else {
            // Menu options
            this.options.forEach((option, i) => {
                const oy = CANVAS_HEIGHT - 50 * SCALE + i * 16 * SCALE;
                if (i === this.selectedIndex) {
                    SpriteRenderer.drawText(ctx, '\u25B6', CANVAS_WIDTH / 2 - 45 * SCALE, oy, 8 * SCALE, '#fff');
                }
                SpriteRenderer.drawText(ctx, option, CANVAS_WIDTH / 2 - 32 * SCALE, oy, 8 * SCALE, '#fff');
            });
        }

        // Version info
        SpriteRenderer.drawText(ctx, 'v1.0', 4 * SCALE, CANVAS_HEIGHT - 10 * SCALE, 4 * SCALE, '#80a0c0');
    }
};

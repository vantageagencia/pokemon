// Start menu UI
const MenuUI = {
    active: false,
    selectedIndex: 0,
    items: [],

    open() {
        this.active = true;
        this.selectedIndex = 0;
        this.items = ['POKEDEX', 'POKEMON', 'BAG', 'SAVE', 'OPTIONS', 'EXIT'];
        if (Player.party.length === 0) {
            this.items = this.items.filter(i => i !== 'POKEMON');
        }
        Audio.playSfx('confirm');
    },

    close() {
        this.active = false;
        Audio.playSfx('cancel');
    },

    update() {
        if (!this.active) return null;

        if (Input.downPressed) {
            this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
            Audio.playSfx('select');
        }

        if (Input.cancel || Input.start) {
            this.close();
            return 'close';
        }

        if (Input.confirm) {
            Audio.playSfx('confirm');
            const item = this.items[this.selectedIndex];
            switch (item) {
                case 'POKEDEX': return 'pokedex';
                case 'POKEMON': return 'pokemon';
                case 'BAG': return 'bag';
                case 'SAVE': return 'save';
                case 'OPTIONS': return 'options';
                case 'EXIT': this.close(); return 'close';
            }
        }

        return null;
    },

    draw(ctx) {
        if (!this.active) return;

        const w = 60 * SCALE;
        const h = (this.items.length * 14 + 12) * SCALE;
        const x = CANVAS_WIDTH - w - 4 * SCALE;
        const y = 4 * SCALE;

        SpriteRenderer.drawBox(ctx, x, y, w, h);

        this.items.forEach((item, i) => {
            const iy = y + (8 + i * 14) * SCALE;
            if (i === this.selectedIndex) {
                SpriteRenderer.drawText(ctx, '\u25B6', x + 4 * SCALE, iy, 7 * SCALE, COLORS.TEXT);
            }
            SpriteRenderer.drawText(ctx, item, x + 14 * SCALE, iy, 7 * SCALE, COLORS.TEXT);
        });

        // Player info at bottom of menu
        const infoY = y + h + 4 * SCALE;
        SpriteRenderer.drawBox(ctx, x, infoY, w, 30 * SCALE);
        SpriteRenderer.drawText(ctx, Player.name, x + 6 * SCALE, infoY + 4 * SCALE, 6 * SCALE, COLORS.TEXT);
        SpriteRenderer.drawText(ctx, `$${Player.money}`, x + 6 * SCALE, infoY + 14 * SCALE, 6 * SCALE, COLORS.TEXT);
        SpriteRenderer.drawText(ctx, `Badges: ${Player.badges.length}`, x + 6 * SCALE, infoY + 22 * SCALE, 5 * SCALE, COLORS.TEXT);
    }
};

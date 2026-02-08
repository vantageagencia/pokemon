// Pokedex UI
const PokedexUI = {
    active: false,
    selectedIndex: 0,
    scrollOffset: 0,
    maxVisible: 10,
    allPokemon: [],

    open() {
        this.active = true;
        this.selectedIndex = 0;
        this.scrollOffset = 0;

        // Build list of all Pokemon sorted by ID
        this.allPokemon = Object.entries(PokemonDB)
            .map(([id, data]) => ({ id, data }))
            .sort((a, b) => a.data.id - b.data.id);

        Audio.playSfx('confirm');
    },

    close() {
        this.active = false;
        Audio.playSfx('cancel');
    },

    update() {
        if (!this.active) return null;

        if (Input.downPressed) {
            this.selectedIndex = Math.min(this.allPokemon.length - 1, this.selectedIndex + 1);
            if (this.selectedIndex >= this.scrollOffset + this.maxVisible) {
                this.scrollOffset = this.selectedIndex - this.maxVisible + 1;
            }
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            if (this.selectedIndex < this.scrollOffset) {
                this.scrollOffset = this.selectedIndex;
            }
            Audio.playSfx('select');
        }

        if (Input.cancel) {
            this.close();
            return 'close';
        }

        return null;
    },

    draw(ctx) {
        if (!this.active) return;

        // Background
        ctx.fillStyle = '#e04040';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        SpriteRenderer.drawText(ctx, 'POKEDEX', 8 * SCALE, 4 * SCALE, 8 * SCALE, '#fff');

        // Stats
        const seen = Player.pokedex.seen.size;
        const caught = Player.pokedex.caught.size;
        SpriteRenderer.drawText(ctx, `SEEN: ${seen}  CAUGHT: ${caught}`,
            8 * SCALE, 14 * SCALE, 5 * SCALE, '#fcc');

        // Pokemon list
        const listY = 24 * SCALE;
        const itemH = 14 * SCALE;
        const listX = 8 * SCALE;
        const listW = CANVAS_WIDTH / 2 - 12 * SCALE;

        for (let i = 0; i < this.maxVisible && i + this.scrollOffset < this.allPokemon.length; i++) {
            const entry = this.allPokemon[i + this.scrollOffset];
            const y = listY + i * itemH;
            const isSeen = Player.pokedex.seen.has(entry.id);
            const isCaught = Player.pokedex.caught.has(entry.id);

            if (i + this.scrollOffset === this.selectedIndex) {
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fillRect(listX, y, listW, itemH);
            }

            const num = Utils.padNumber(entry.data.id, 3);
            const icon = isCaught ? '\u25CF' : isSeen ? '\u25CB' : ' ';
            const name = isSeen ? entry.data.name : '???';

            SpriteRenderer.drawText(ctx, `${icon} #${num} ${name}`,
                listX + 2 * SCALE, y + 2 * SCALE, 5 * SCALE,
                isCaught ? '#fff' : isSeen ? '#fcc' : '#a06060');
        }

        // Detail panel (right side)
        const selected = this.allPokemon[this.selectedIndex];
        if (selected && Player.pokedex.seen.has(selected.id)) {
            const detailX = CANVAS_WIDTH / 2 + 4 * SCALE;
            const detailY = 24 * SCALE;

            // Pokemon sprite
            const spriteData = PokemonSprites.getSprite(selected.id, 'front');
            SpriteRenderer.draw(ctx, spriteData.sprite, detailX + 10 * SCALE, detailY, SCALE * 3, spriteData.palette);

            // Info
            const infoY = detailY + 52 * SCALE;
            SpriteRenderer.drawText(ctx, `#${Utils.padNumber(selected.data.id, 3)} ${selected.data.name}`,
                detailX, infoY, 6 * SCALE, '#fff');

            // Types
            selected.data.types.forEach((type, i) => {
                const typeX = detailX + i * 35 * SCALE;
                ctx.fillStyle = TYPE_COLORS[type] || '#a8a878';
                ctx.fillRect(typeX, infoY + 12 * SCALE, 30 * SCALE, 8 * SCALE);
                SpriteRenderer.drawText(ctx, type, typeX + 2 * SCALE, infoY + 13 * SCALE, 5 * SCALE, '#fff');
            });

            if (Player.pokedex.caught.has(selected.id)) {
                // Show base stats
                const statsY = infoY + 25 * SCALE;
                const stats = selected.data.baseStats;
                const statNames = ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'];
                const statValues = [stats.hp, stats.attack, stats.defense, stats.spAttack, stats.spDefense, stats.speed];

                statNames.forEach((name, i) => {
                    const sy = statsY + i * 9 * SCALE;
                    SpriteRenderer.drawText(ctx, name, detailX, sy, 5 * SCALE, '#fcc');
                    // Stat bar
                    const barW = Math.min(60 * SCALE, (statValues[i] / 255) * 60 * SCALE);
                    ctx.fillStyle = '#400000';
                    ctx.fillRect(detailX + 20 * SCALE, sy + 1 * SCALE, 60 * SCALE, 4 * SCALE);
                    ctx.fillStyle = statValues[i] > 100 ? '#40e040' : statValues[i] > 60 ? '#e0e040' : '#e04040';
                    ctx.fillRect(detailX + 20 * SCALE, sy + 1 * SCALE, barW, 4 * SCALE);
                    SpriteRenderer.drawText(ctx, String(statValues[i]),
                        detailX + 82 * SCALE, sy, 4 * SCALE, '#fff');
                });
            }
        }

        // Scroll indicator
        if (this.allPokemon.length > this.maxVisible) {
            if (this.scrollOffset > 0) {
                SpriteRenderer.drawText(ctx, '\u25B2', listX + listW / 2, listY - 6 * SCALE, 5 * SCALE, '#fff');
            }
            if (this.scrollOffset + this.maxVisible < this.allPokemon.length) {
                SpriteRenderer.drawText(ctx, '\u25BC', listX + listW / 2, listY + this.maxVisible * itemH, 5 * SCALE, '#fff');
            }
        }
    }
};

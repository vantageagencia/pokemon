// Evolution animation system
const EvolutionSystem = {
    active: false,
    pokemon: null,
    phase: 0,
    timer: 0,
    flashRate: 0,
    oldName: '',
    newName: '',
    callback: null,

    start(pokemon, callback) {
        this.active = true;
        this.pokemon = pokemon;
        this.phase = 0;
        this.timer = 0;
        this.flashRate = 10;
        this.oldName = pokemon.name;
        this.callback = callback;

        Audio.playSfx('evolution');
    },

    update() {
        if (!this.active) return;

        this.timer++;

        switch (this.phase) {
            case 0: // Flashing
                this.flashRate = Math.max(2, 10 - Math.floor(this.timer / 20));
                if (this.timer > 120) {
                    this.phase = 1;
                    this.timer = 0;
                    PokemonFactory.evolve(this.pokemon);
                    this.newName = this.pokemon.name;
                }
                break;
            case 1: // Show new form
                if (this.timer > 60) {
                    this.phase = 2;
                    this.timer = 0;
                }
                break;
            case 2: // Done
                if (Input.confirm) {
                    this.active = false;
                    if (this.callback) this.callback();
                }
                break;
        }
    },

    draw(ctx) {
        if (!this.active) return;

        // Black background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2 - 8 * SCALE;
        const centerY = CANVAS_HEIGHT / 2 - 8 * SCALE;

        if (this.phase === 0) {
            // Flash between old and new sprite
            const showNew = Math.floor(this.timer / this.flashRate) % 2 === 0;
            const spriteData = PokemonSprites.getSprite(
                showNew ? PokemonDB[this.pokemon.speciesId].evolution?.into || this.pokemon.speciesId : this.pokemon.speciesId,
                'front'
            );
            if (spriteData.palette) {
                SpriteRenderer.draw(ctx, spriteData.sprite, centerX, centerY, SCALE * 3, spriteData.palette);
            } else {
                SpriteRenderer.draw(ctx, spriteData.sprite, centerX, centerY, SCALE * 3);
            }

            SpriteRenderer.drawText(ctx, `${this.oldName} is evolving!`,
                CANVAS_WIDTH / 2 - 100 * SCALE, CANVAS_HEIGHT - 40 * SCALE, 8 * SCALE, COLORS.WHITE);
        } else {
            // Show new form
            const spriteData = PokemonSprites.getSprite(this.pokemon.speciesId, 'front');
            if (spriteData.palette) {
                SpriteRenderer.draw(ctx, spriteData.sprite, centerX, centerY, SCALE * 3, spriteData.palette);
            } else {
                SpriteRenderer.draw(ctx, spriteData.sprite, centerX, centerY, SCALE * 3);
            }

            SpriteRenderer.drawText(ctx, `${this.oldName} evolved into ${this.newName}!`,
                CANVAS_WIDTH / 2 - 120 * SCALE, CANVAS_HEIGHT - 40 * SCALE, 8 * SCALE, COLORS.WHITE);
        }
    }
};

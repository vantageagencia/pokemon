// Pokemon Party UI
const PartyUI = {
    active: false,
    selectedIndex: 0,
    mode: 'view', // 'view', 'battle_switch', 'item_use'
    actionMenuOpen: false,
    actionIndex: 0,
    onSelect: null,

    open(mode = 'view', callback = null) {
        this.active = true;
        this.selectedIndex = 0;
        this.mode = mode;
        this.actionMenuOpen = false;
        this.onSelect = callback;
        Audio.playSfx('confirm');
    },

    close() {
        this.active = false;
        Audio.playSfx('cancel');
    },

    update() {
        if (!this.active) return null;

        if (this.actionMenuOpen) {
            return this._updateActionMenu();
        }

        const partySize = Player.party.length;
        if (partySize === 0) {
            if (Input.cancel) { this.close(); return 'close'; }
            return null;
        }

        if (Input.downPressed) {
            this.selectedIndex = Math.min(partySize, this.selectedIndex + 1); // extra slot for "Cancel"
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            Audio.playSfx('select');
        }

        if (Input.cancel) {
            this.close();
            return 'close';
        }

        if (Input.confirm) {
            if (this.selectedIndex >= partySize) {
                // Cancel button
                this.close();
                return 'close';
            }

            const pokemon = Player.party[this.selectedIndex];

            if (this.mode === 'battle_switch') {
                if (pokemon.currentHp <= 0) {
                    Audio.playSfx('bump');
                    return null;
                }
                if (Battle.active && this.selectedIndex === Battle.playerPartyIndex) {
                    Audio.playSfx('bump');
                    return null;
                }
                Audio.playSfx('confirm');
                this.close();
                if (this.onSelect) this.onSelect(this.selectedIndex);
                return 'switch';
            }

            if (this.mode === 'item_use') {
                Audio.playSfx('confirm');
                this.close();
                if (this.onSelect) this.onSelect(this.selectedIndex);
                return 'item_used';
            }

            // View mode - open action menu
            Audio.playSfx('confirm');
            this.actionMenuOpen = true;
            this.actionIndex = 0;
        }

        return null;
    },

    _updateActionMenu() {
        const actions = ['SUMMARY', 'SWITCH', 'CANCEL'];

        if (Input.downPressed) {
            this.actionIndex = (this.actionIndex + 1) % actions.length;
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.actionIndex = (this.actionIndex - 1 + actions.length) % actions.length;
            Audio.playSfx('select');
        }
        if (Input.cancel) {
            this.actionMenuOpen = false;
            Audio.playSfx('cancel');
            return null;
        }
        if (Input.confirm) {
            Audio.playSfx('confirm');
            switch (actions[this.actionIndex]) {
                case 'SUMMARY':
                    // Could show detailed stats
                    this.actionMenuOpen = false;
                    break;
                case 'SWITCH':
                    // Swap pokemon positions in party
                    this.actionMenuOpen = false;
                    break;
                case 'CANCEL':
                    this.actionMenuOpen = false;
                    break;
            }
        }

        return null;
    },

    draw(ctx) {
        if (!this.active) return;

        // Background
        ctx.fillStyle = '#e0e8f0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        SpriteRenderer.drawText(ctx, 'POKEMON', 8 * SCALE, 4 * SCALE, 8 * SCALE, COLORS.TEXT);

        // Party list
        Player.party.forEach((pokemon, i) => {
            const y = (20 + i * 28) * SCALE;
            const x = 8 * SCALE;
            const w = CANVAS_WIDTH - 16 * SCALE;
            const h = 26 * SCALE;

            // Background
            const bgColor = pokemon.currentHp <= 0 ? '#d08080' :
                i === this.selectedIndex ? '#80a0d0' : '#a0b8d0';
            ctx.fillStyle = bgColor;
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = '#506080';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);

            // Pokemon mini sprite
            const spriteData = PokemonSprites.getSprite(pokemon.speciesId, 'front');
            SpriteRenderer.draw(ctx, spriteData.sprite, x + 2 * SCALE, y + 2 * SCALE, SCALE * 1.4, spriteData.palette);

            // Name and level
            SpriteRenderer.drawText(ctx, pokemon.nickname || pokemon.name,
                x + 26 * SCALE, y + 2 * SCALE, 7 * SCALE, COLORS.TEXT);
            SpriteRenderer.drawText(ctx, `Lv${pokemon.level}`,
                x + 26 * SCALE, y + 12 * SCALE, 6 * SCALE, COLORS.DARK);

            // Status
            if (pokemon.status) {
                BattleUI._drawStatus(ctx, x + 70 * SCALE, y + 12 * SCALE, pokemon.status);
            }

            // HP bar
            const hpBarX = x + w - 80 * SCALE;
            const hpBarY = y + 6 * SCALE;
            SpriteRenderer.drawText(ctx, 'HP', hpBarX - 12 * SCALE, y + 3 * SCALE, 5 * SCALE, COLORS.TEXT);
            SpriteRenderer.drawHPBar(ctx, hpBarX, hpBarY, 60 * SCALE, 4 * SCALE, pokemon.currentHp / pokemon.maxHp);
            SpriteRenderer.drawText(ctx, `${pokemon.currentHp}/${pokemon.maxHp}`,
                hpBarX + 10 * SCALE, y + 14 * SCALE, 5 * SCALE, COLORS.TEXT);

            // Selection cursor
            if (i === this.selectedIndex) {
                SpriteRenderer.drawText(ctx, '\u25B6', x - 6 * SCALE, y + 6 * SCALE, 8 * SCALE, COLORS.TEXT);
            }
        });

        // Cancel option
        const cancelY = (20 + Player.party.length * 28) * SCALE;
        if (this.selectedIndex >= Player.party.length) {
            SpriteRenderer.drawText(ctx, '\u25B6 CANCEL', 8 * SCALE, cancelY + 4 * SCALE, 7 * SCALE, COLORS.TEXT);
        } else {
            SpriteRenderer.drawText(ctx, '  CANCEL', 8 * SCALE, cancelY + 4 * SCALE, 7 * SCALE, COLORS.DARK);
        }

        // Action menu
        if (this.actionMenuOpen) {
            const amW = 50 * SCALE;
            const amH = 50 * SCALE;
            const amX = CANVAS_WIDTH - amW - 8 * SCALE;
            const amY = CANVAS_HEIGHT - amH - 8 * SCALE;
            SpriteRenderer.drawBox(ctx, amX, amY, amW, amH);

            ['SUMMARY', 'SWITCH', 'CANCEL'].forEach((action, i) => {
                const ay = amY + (8 + i * 14) * SCALE;
                if (i === this.actionIndex) {
                    SpriteRenderer.drawText(ctx, '\u25B6', amX + 4 * SCALE, ay, 6 * SCALE, COLORS.TEXT);
                }
                SpriteRenderer.drawText(ctx, action, amX + 12 * SCALE, ay, 6 * SCALE, COLORS.TEXT);
            });
        }

        // Mode-specific text
        if (this.mode === 'battle_switch') {
            SpriteRenderer.drawBox(ctx, 0, CANVAS_HEIGHT - 20 * SCALE, CANVAS_WIDTH, 20 * SCALE);
            SpriteRenderer.drawText(ctx, 'Choose a Pokemon to send out.',
                8 * SCALE, CANVAS_HEIGHT - 16 * SCALE, 6 * SCALE, COLORS.TEXT);
        }
    }
};

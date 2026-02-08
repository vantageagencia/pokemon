// Bag/Inventory UI
const BagUI = {
    active: false,
    selectedIndex: 0,
    category: 0, // 0=items, 1=balls, 2=key items
    mode: 'menu', // 'menu', 'battle'
    items: [],
    onUse: null,

    open(mode = 'menu', callback = null) {
        this.active = true;
        this.selectedIndex = 0;
        this.category = 0;
        this.mode = mode;
        this.onUse = callback;
        this._refreshItems();
        Audio.playSfx('confirm');
    },

    close() {
        this.active = false;
        Audio.playSfx('cancel');
    },

    _refreshItems() {
        switch (this.category) {
            case 0: this.items = Inventory.getMedicineItems(); break;
            case 1: this.items = Inventory.getBallItems(); break;
            case 2: this.items = Inventory.getKeyItems(); break;
        }
    },

    update() {
        if (!this.active) return null;

        if (Input.leftPressed) {
            this.category = (this.category - 1 + 3) % 3;
            this.selectedIndex = 0;
            this._refreshItems();
            Audio.playSfx('select');
        }
        if (Input.rightPressed) {
            this.category = (this.category + 1) % 3;
            this.selectedIndex = 0;
            this._refreshItems();
            Audio.playSfx('select');
        }

        const maxIndex = this.items.length; // +1 for Cancel
        if (Input.downPressed) {
            this.selectedIndex = Math.min(maxIndex, this.selectedIndex + 1);
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
            if (this.selectedIndex >= this.items.length) {
                this.close();
                return 'close';
            }

            const item = this.items[this.selectedIndex];
            Audio.playSfx('confirm');

            if (this.mode === 'battle') {
                return this._useBattleItem(item);
            } else {
                return this._useMenuItem(item);
            }
        }

        return null;
    },

    _useBattleItem(item) {
        if (item.data.type === 'ball') {
            // Use pokeball
            Inventory.removeItem(item.id);
            this.close();
            Battle.usePokeball(item.data);
            return 'used_ball';
        }

        if (item.data.type === 'medicine') {
            if (item.data.healAmount || item.data.cureStatus) {
                Inventory.removeItem(item.id);
                this.close();
                Battle.useItem(item.data);
                return 'used_item';
            }
        }

        return null;
    },

    _useMenuItem(item) {
        if (item.data.type === 'medicine') {
            if (item.data.healAmount || item.data.cureStatus || item.data.revive) {
                // Open party to select pokemon
                this.close();
                return { type: 'use_on_pokemon', item };
            }
        }
        return null;
    },

    // Use item on specific pokemon (outside battle)
    useItemOnPokemon(item, pokemonIndex) {
        const pokemon = Player.party[pokemonIndex];
        if (!pokemon) return false;

        if (item.data.revive) {
            if (pokemon.currentHp > 0) return false; // Can't use on alive pokemon
            pokemon.currentHp = Math.floor(pokemon.maxHp * item.data.healPercent);
            pokemon.status = null;
            Inventory.removeItem(item.id);
            Audio.playSfx('heal');
            return true;
        }

        if (pokemon.currentHp <= 0) return false; // Can't use on fainted pokemon

        if (item.data.healAmount) {
            if (pokemon.currentHp >= pokemon.maxHp) return false;
            pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + item.data.healAmount);
            if (item.data.cureStatus === true) pokemon.status = null;
            Inventory.removeItem(item.id);
            Audio.playSfx('heal');
            return true;
        }

        if (item.data.cureStatus) {
            if (!pokemon.status) return false;
            if (item.data.cureStatus !== true && item.data.cureStatus !== pokemon.status) return false;
            pokemon.status = null;
            Inventory.removeItem(item.id);
            Audio.playSfx('heal');
            return true;
        }

        if (item.data.levelUp) {
            if (pokemon.level >= 100) return false;
            PokemonFactory.levelUp(pokemon);
            Inventory.removeItem(item.id);
            Audio.playSfx('level_up');
            return true;
        }

        return false;
    },

    draw(ctx) {
        if (!this.active) return;

        // Background
        ctx.fillStyle = '#e8e0d0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Category tabs
        const categories = ['MEDICINE', 'POKE BALLS', 'KEY ITEMS'];
        const tabW = CANVAS_WIDTH / 3;
        categories.forEach((cat, i) => {
            ctx.fillStyle = i === this.category ? '#f8f0e0' : '#c8c0b0';
            ctx.fillRect(i * tabW, 0, tabW, 18 * SCALE);
            ctx.strokeStyle = '#806040';
            ctx.lineWidth = 1;
            ctx.strokeRect(i * tabW, 0, tabW, 18 * SCALE);
            SpriteRenderer.drawText(ctx, cat, i * tabW + 4 * SCALE, 4 * SCALE,
                5 * SCALE, i === this.category ? COLORS.TEXT : COLORS.DARK);
        });

        // Item list
        const listY = 22 * SCALE;
        const itemH = 16 * SCALE;

        if (this.items.length === 0) {
            SpriteRenderer.drawText(ctx, 'No items.', 20 * SCALE, listY + 10 * SCALE, 7 * SCALE, COLORS.DARK);
        }

        this.items.forEach((item, i) => {
            const y = listY + i * itemH;
            if (i === this.selectedIndex) {
                ctx.fillStyle = 'rgba(64, 128, 192, 0.2)';
                ctx.fillRect(4 * SCALE, y, CANVAS_WIDTH - 8 * SCALE, itemH);
                SpriteRenderer.drawText(ctx, '\u25B6', 4 * SCALE, y + 3 * SCALE, 7 * SCALE, COLORS.TEXT);
            }

            SpriteRenderer.drawText(ctx, item.data.name, 16 * SCALE, y + 3 * SCALE, 6 * SCALE, COLORS.TEXT);
            SpriteRenderer.drawText(ctx, `x${item.count}`, CANVAS_WIDTH - 30 * SCALE, y + 3 * SCALE, 6 * SCALE, COLORS.TEXT);
        });

        // Cancel option
        const cancelY = listY + this.items.length * itemH;
        if (this.selectedIndex >= this.items.length) {
            SpriteRenderer.drawText(ctx, '\u25B6 CANCEL', 4 * SCALE, cancelY + 3 * SCALE, 7 * SCALE, COLORS.TEXT);
        } else {
            SpriteRenderer.drawText(ctx, '  CANCEL', 4 * SCALE, cancelY + 3 * SCALE, 7 * SCALE, COLORS.DARK);
        }

        // Item description
        if (this.selectedIndex < this.items.length) {
            const descY = CANVAS_HEIGHT - 30 * SCALE;
            SpriteRenderer.drawBox(ctx, 0, descY, CANVAS_WIDTH, 30 * SCALE);
            SpriteRenderer.drawText(ctx, this.items[this.selectedIndex].data.description,
                8 * SCALE, descY + 6 * SCALE, 6 * SCALE, COLORS.TEXT, CANVAS_WIDTH - 16 * SCALE);
        }
    }
};

// Shop UI
const ShopUI = {
    active: false,
    selectedIndex: 0,
    items: [],
    mode: 'buy', // 'buy', 'sell', 'main'
    quantity: 1,
    selectingQuantity: false,

    open(shopItems) {
        this.active = true;
        this.selectedIndex = 0;
        this.mode = 'main';
        this.items = shopItems.map(id => ({
            id,
            data: ItemDB[id]
        })).filter(item => item.data);
        this.selectingQuantity = false;
        Audio.playSfx('confirm');
    },

    close() {
        this.active = false;
        Audio.playSfx('cancel');
    },

    update() {
        if (!this.active) return null;

        if (this.mode === 'main') {
            return this._updateMainMenu();
        }

        if (this.selectingQuantity) {
            return this._updateQuantity();
        }

        if (this.mode === 'buy') {
            return this._updateBuy();
        }

        return null;
    },

    _updateMainMenu() {
        if (Input.confirm) {
            Audio.playSfx('confirm');
            if (this.selectedIndex === 0) {
                this.mode = 'buy';
                this.selectedIndex = 0;
            } else {
                this.close();
                return 'close';
            }
        }
        if (Input.cancel) {
            this.close();
            return 'close';
        }
        if (Input.downPressed || Input.upPressed) {
            this.selectedIndex = 1 - this.selectedIndex;
            Audio.playSfx('select');
        }
        return null;
    },

    _updateBuy() {
        const maxIndex = this.items.length; // extra for Cancel
        if (Input.downPressed) {
            this.selectedIndex = Math.min(maxIndex, this.selectedIndex + 1);
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            Audio.playSfx('select');
        }

        if (Input.cancel) {
            this.mode = 'main';
            this.selectedIndex = 0;
            Audio.playSfx('cancel');
            return null;
        }

        if (Input.confirm) {
            if (this.selectedIndex >= this.items.length) {
                this.mode = 'main';
                this.selectedIndex = 0;
                Audio.playSfx('cancel');
                return null;
            }

            // Start quantity selection
            this.quantity = 1;
            this.selectingQuantity = true;
            Audio.playSfx('confirm');
        }

        return null;
    },

    _updateQuantity() {
        const item = this.items[this.selectedIndex];
        const maxQuantity = Math.min(99, Math.floor(Player.money / item.data.price));

        if (Input.upPressed) {
            this.quantity = Math.min(maxQuantity, this.quantity + 1);
            Audio.playSfx('select');
        }
        if (Input.downPressed) {
            this.quantity = Math.max(1, this.quantity - 1);
            Audio.playSfx('select');
        }
        if (Input.rightPressed) {
            this.quantity = Math.min(maxQuantity, this.quantity + 10);
            Audio.playSfx('select');
        }
        if (Input.leftPressed) {
            this.quantity = Math.max(1, this.quantity - 10);
            Audio.playSfx('select');
        }

        if (Input.cancel) {
            this.selectingQuantity = false;
            Audio.playSfx('cancel');
            return null;
        }

        if (Input.confirm) {
            const cost = item.data.price * this.quantity;
            if (cost <= Player.money) {
                Player.money -= cost;
                Inventory.addItem(item.id, this.quantity);
                Audio.playSfx('purchase');
                this.selectingQuantity = false;
            } else {
                Audio.playSfx('bump');
            }
        }

        return null;
    },

    draw(ctx) {
        if (!this.active) return;

        // Background
        ctx.fillStyle = '#e0e8d0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Money display
        SpriteRenderer.drawBox(ctx, CANVAS_WIDTH - 60 * SCALE, 4 * SCALE, 56 * SCALE, 16 * SCALE);
        SpriteRenderer.drawText(ctx, `$${Player.money}`,
            CANVAS_WIDTH - 55 * SCALE, 8 * SCALE, 7 * SCALE, COLORS.TEXT);

        if (this.mode === 'main') {
            // Buy/Sell/Cancel menu
            SpriteRenderer.drawBox(ctx, 8 * SCALE, 8 * SCALE, 50 * SCALE, 40 * SCALE);
            ['BUY', 'CANCEL'].forEach((opt, i) => {
                const y = (14 + i * 14) * SCALE;
                if (i === this.selectedIndex) {
                    SpriteRenderer.drawText(ctx, '\u25B6', 12 * SCALE, y, 7 * SCALE, COLORS.TEXT);
                }
                SpriteRenderer.drawText(ctx, opt, 22 * SCALE, y, 7 * SCALE, COLORS.TEXT);
            });

            // Welcome text
            SpriteRenderer.drawBox(ctx, 0, CANVAS_HEIGHT - 30 * SCALE, CANVAS_WIDTH, 30 * SCALE);
            SpriteRenderer.drawText(ctx, 'How may I help you?',
                8 * SCALE, CANVAS_HEIGHT - 22 * SCALE, 7 * SCALE, COLORS.TEXT);
            return;
        }

        // Shop title
        SpriteRenderer.drawText(ctx, 'POKE MART', 8 * SCALE, 4 * SCALE, 8 * SCALE, COLORS.TEXT);

        // Item list
        const listY = 24 * SCALE;
        const itemH = 16 * SCALE;

        this.items.forEach((item, i) => {
            const y = listY + i * itemH;
            if (i === this.selectedIndex && !this.selectingQuantity) {
                ctx.fillStyle = 'rgba(64, 128, 64, 0.2)';
                ctx.fillRect(4 * SCALE, y, CANVAS_WIDTH - 8 * SCALE, itemH);
                SpriteRenderer.drawText(ctx, '\u25B6', 4 * SCALE, y + 3 * SCALE, 7 * SCALE, COLORS.TEXT);
            }

            SpriteRenderer.drawText(ctx, item.data.name, 16 * SCALE, y + 3 * SCALE, 6 * SCALE, COLORS.TEXT);
            SpriteRenderer.drawText(ctx, `$${item.data.price}`,
                CANVAS_WIDTH - 40 * SCALE, y + 3 * SCALE, 6 * SCALE, COLORS.TEXT);

            // Show owned count
            const owned = Inventory.getCount(item.id);
            if (owned > 0) {
                SpriteRenderer.drawText(ctx, `x${owned}`,
                    CANVAS_WIDTH - 60 * SCALE, y + 3 * SCALE, 5 * SCALE, COLORS.DARK);
            }
        });

        // Cancel option
        const cancelY = listY + this.items.length * itemH;
        if (this.selectedIndex >= this.items.length) {
            SpriteRenderer.drawText(ctx, '\u25B6 CANCEL', 4 * SCALE, cancelY + 3 * SCALE, 7 * SCALE, COLORS.TEXT);
        } else {
            SpriteRenderer.drawText(ctx, '  CANCEL', 4 * SCALE, cancelY + 3 * SCALE, 7 * SCALE, COLORS.DARK);
        }

        // Quantity selector
        if (this.selectingQuantity) {
            const item = this.items[this.selectedIndex];
            const qW = 60 * SCALE;
            const qH = 30 * SCALE;
            const qX = CANVAS_WIDTH / 2 - qW / 2;
            const qY = CANVAS_HEIGHT / 2 - qH / 2;

            SpriteRenderer.drawBox(ctx, qX, qY, qW, qH);
            SpriteRenderer.drawText(ctx, `x ${this.quantity}`, qX + 8 * SCALE, qY + 4 * SCALE, 7 * SCALE, COLORS.TEXT);
            SpriteRenderer.drawText(ctx, `$${item.data.price * this.quantity}`,
                qX + 8 * SCALE, qY + 16 * SCALE, 7 * SCALE, COLORS.TEXT);
        }

        // Description
        if (this.selectedIndex < this.items.length) {
            const descY = CANVAS_HEIGHT - 24 * SCALE;
            SpriteRenderer.drawBox(ctx, 0, descY, CANVAS_WIDTH, 24 * SCALE);
            SpriteRenderer.drawText(ctx, this.items[this.selectedIndex].data.description,
                8 * SCALE, descY + 6 * SCALE, 6 * SCALE, COLORS.TEXT, CANVAS_WIDTH - 16 * SCALE);
        }
    }
};

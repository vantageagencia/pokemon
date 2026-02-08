// Pixel art sprite renderer - draws sprites from pixel data arrays
const SpriteRenderer = {
    cache: {},

    // Draw sprite from pixel data
    draw(ctx, spriteData, x, y, scale = SCALE, palette = null) {
        const key = JSON.stringify(spriteData) + (palette ? JSON.stringify(palette) : '');
        if (!this.cache[key]) {
            this.cache[key] = this._createCanvas(spriteData, palette);
        }
        ctx.drawImage(this.cache[key], x, y, spriteData[0].length * scale, spriteData.length * scale);
    },

    // Draw sprite flipped horizontally
    drawFlipped(ctx, spriteData, x, y, scale = SCALE, palette = null) {
        ctx.save();
        ctx.scale(-1, 1);
        this.draw(ctx, spriteData, -x - spriteData[0].length * scale, y, scale, palette);
        ctx.restore();
    },

    _createCanvas(spriteData, palette) {
        const c = document.createElement('canvas');
        c.width = spriteData[0].length;
        c.height = spriteData.length;
        const ctx = c.getContext('2d');
        const imgData = ctx.createImageData(c.width, c.height);

        const defaultPalette = {
            '.': null, // transparent
            '0': [24, 24, 24],      // black
            '1': [104, 104, 104],    // dark
            '2': [192, 192, 192],    // light
            '3': [248, 248, 248],    // white
            'R': [224, 48, 48],      // red
            'r': [176, 32, 32],      // dark red
            'B': [48, 96, 224],      // blue
            'b': [32, 64, 160],      // dark blue
            'G': [48, 168, 48],      // green
            'g': [32, 120, 32],      // dark green
            'Y': [248, 208, 48],     // yellow
            'y': [200, 168, 32],     // dark yellow
            'O': [240, 128, 48],     // orange
            'o': [192, 96, 32],      // dark orange
            'P': [168, 80, 168],     // purple
            'p': [120, 48, 120],     // dark purple
            'W': [160, 200, 248],    // water blue
            'w': [120, 160, 224],    // dark water
            'T': [120, 200, 80],     // tree green
            't': [80, 152, 48],      // dark tree
            'S': [248, 224, 168],    // sand
            's': [216, 192, 128],    // dark sand
            'F': [248, 176, 128],    // skin
            'f': [216, 144, 96],     // dark skin
            'C': [160, 160, 160],    // concrete
            'c': [120, 120, 120],    // dark concrete
        };

        const pal = palette || defaultPalette;

        for (let row = 0; row < spriteData.length; row++) {
            for (let col = 0; col < spriteData[row].length; col++) {
                const char = spriteData[row][col];
                const color = pal[char];
                const idx = (row * c.width + col) * 4;
                if (color) {
                    imgData.data[idx] = color[0];
                    imgData.data[idx + 1] = color[1];
                    imgData.data[idx + 2] = color[2];
                    imgData.data[idx + 3] = 255;
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return c;
    },

    // Draw a filled rectangle
    drawRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },

    // Draw a Pokemon-style bordered box
    drawBox(ctx, x, y, w, h, fillColor = COLORS.MENU_BG, borderColor = COLORS.MENU_BORDER) {
        const b = 2 * SCALE;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + b, y + b, w, h);
        // Border
        ctx.fillStyle = borderColor;
        ctx.fillRect(x, y, w, h);
        // Inner
        ctx.fillStyle = fillColor;
        ctx.fillRect(x + b, y + b, w - b * 2, h - b * 2);
    },

    // Draw text in Pokemon style
    drawText(ctx, text, x, y, size = 8 * SCALE, color = COLORS.TEXT, maxWidth = null) {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px 'Courier New', monospace`;
        ctx.textBaseline = 'top';

        if (maxWidth) {
            // Word wrap
            const words = text.split(' ');
            let line = '';
            let lineY = y;
            const lineHeight = size * 1.3;

            for (const word of words) {
                const testLine = line + (line ? ' ' : '') + word;
                if (ctx.measureText(testLine).width > maxWidth && line) {
                    ctx.fillText(line, x, lineY);
                    line = word;
                    lineY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, lineY);
            return lineY + lineHeight;
        } else {
            ctx.fillText(text, x, y);
            return y + size * 1.3;
        }
    },

    // Draw HP bar
    drawHPBar(ctx, x, y, w, h, ratio) {
        // Background
        ctx.fillStyle = '#383838';
        ctx.fillRect(x, y, w, h);
        // HP fill
        const color = ratio > 0.5 ? COLORS.HP_GREEN : ratio > 0.2 ? COLORS.HP_YELLOW : COLORS.HP_RED;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(0, w * ratio), h);
    },

    // Draw EXP bar
    drawExpBar(ctx, x, y, w, h, ratio) {
        ctx.fillStyle = '#383838';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = COLORS.EXP_BLUE;
        ctx.fillRect(x, y, w * ratio, h);
    }
};

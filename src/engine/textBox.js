// Text box system for dialogue and messages
const TextBox = {
    active: false,
    lines: [],
    currentLine: 0,
    currentChar: 0,
    charTimer: 0,
    charSpeed: 2, // frames per character
    displayedText: '',
    onComplete: null,
    waitingForInput: false,
    choices: null,
    selectedChoice: 0,
    onChoice: null,

    show(text, callback = null) {
        this.active = true;
        // Split into lines that fit the text box
        this.lines = this._wrapText(text);
        this.currentLine = 0;
        this.currentChar = 0;
        this.charTimer = 0;
        this.displayedText = '';
        this.onComplete = callback;
        this.waitingForInput = false;
        this.choices = null;
    },

    showChoice(text, choices, callback) {
        this.show(text, () => {
            this.choices = choices;
            this.selectedChoice = 0;
            this.onChoice = callback;
            this.waitingForInput = true;
        });
    },

    update() {
        if (!this.active) return;

        if (this.choices && this.waitingForInput) {
            if (Input.upPressed) {
                this.selectedChoice = Math.max(0, this.selectedChoice - 1);
                Audio.playSfx('select');
            }
            if (Input.downPressed) {
                this.selectedChoice = Math.min(this.choices.length - 1, this.selectedChoice + 1);
                Audio.playSfx('select');
            }
            if (Input.confirm) {
                Audio.playSfx('confirm');
                const choice = this.selectedChoice;
                this.active = false;
                this.choices = null;
                if (this.onChoice) this.onChoice(choice);
                return;
            }
            if (Input.cancel) {
                Audio.playSfx('cancel');
                this.active = false;
                this.choices = null;
                if (this.onChoice) this.onChoice(this.choices.length - 1); // last option = cancel
                return;
            }
            return;
        }

        if (this.waitingForInput) {
            if (Input.confirm || Input.cancel) {
                Audio.playSfx('select');
                if (this.currentLine < this.lines.length - 1) {
                    // Next page
                    this.currentLine++;
                    this.currentChar = 0;
                    this.displayedText = '';
                    this.waitingForInput = false;
                } else {
                    // Done
                    this.active = false;
                    if (this.onComplete) this.onComplete();
                }
            }
            return;
        }

        // Animate text
        this.charTimer++;
        const speed = Input.isDown('KeyZ') ? 1 : this.charSpeed;
        if (this.charTimer >= speed) {
            this.charTimer = 0;
            const line = this.lines[this.currentLine];
            if (this.currentChar < line.length) {
                this.displayedText += line[this.currentChar];
                this.currentChar++;
                if (this.currentChar % 2 === 0) Audio.playSfx('text');
            } else {
                this.waitingForInput = true;
            }
        }

        // Skip with confirm
        if (Input.confirm && this.currentChar < this.lines[this.currentLine].length) {
            this.displayedText = this.lines[this.currentLine];
            this.currentChar = this.lines[this.currentLine].length;
            this.waitingForInput = true;
        }
    },

    draw(ctx) {
        if (!this.active) return;

        const boxH = 60 * SCALE;
        const boxY = CANVAS_HEIGHT - boxH - 4 * SCALE;
        const boxX = 4 * SCALE;
        const boxW = CANVAS_WIDTH - 8 * SCALE;

        SpriteRenderer.drawBox(ctx, boxX, boxY, boxW, boxH);

        // Draw text
        const textX = boxX + 8 * SCALE;
        const textY = boxY + 8 * SCALE;
        SpriteRenderer.drawText(ctx, this.displayedText, textX, textY, 7 * SCALE, COLORS.TEXT, boxW - 16 * SCALE);

        // Draw continuation arrow
        if (this.waitingForInput && !this.choices) {
            const arrowY = boxY + boxH - 12 * SCALE + Math.sin(Date.now() / 200) * 2 * SCALE;
            SpriteRenderer.drawText(ctx, '\u25BC', boxX + boxW - 16 * SCALE, arrowY, 7 * SCALE, COLORS.TEXT);
        }

        // Draw choices
        if (this.choices && this.waitingForInput) {
            const choiceW = 50 * SCALE;
            const choiceH = (this.choices.length * 14 + 8) * SCALE;
            const choiceX = CANVAS_WIDTH - choiceW - 8 * SCALE;
            const choiceY = boxY - choiceH - 4 * SCALE;

            SpriteRenderer.drawBox(ctx, choiceX, choiceY, choiceW, choiceH);

            this.choices.forEach((choice, i) => {
                const cy = choiceY + (8 + i * 14) * SCALE;
                if (i === this.selectedChoice) {
                    SpriteRenderer.drawText(ctx, '\u25B6', choiceX + 4 * SCALE, cy, 7 * SCALE, COLORS.TEXT);
                }
                SpriteRenderer.drawText(ctx, choice, choiceX + 14 * SCALE, cy, 7 * SCALE, COLORS.TEXT);
            });
        }
    },

    _wrapText(text) {
        const maxCharsPerLine = 36;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if (word === '\\n') {
                lines.push(currentLine);
                currentLine = '';
                continue;
            }
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length > maxCharsPerLine) {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }
};

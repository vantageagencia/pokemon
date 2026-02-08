// Battle UI renderer
const BattleUI = {
    screenFlash: 0,
    transitionProgress: 0,
    entering: false,
    exiting: false,

    startTransition(callback) {
        this.entering = true;
        this.transitionProgress = 0;
        this.transitionCallback = callback;
    },

    startExitTransition(callback) {
        this.exiting = true;
        this.transitionProgress = 1;
        this.exitCallback = callback;
    },

    updateTransition() {
        if (this.entering) {
            this.transitionProgress += 0.02;
            if (this.transitionProgress >= 1) {
                this.entering = false;
                if (this.transitionCallback) this.transitionCallback();
            }
            return true;
        }
        if (this.exiting) {
            this.transitionProgress -= 0.03;
            if (this.transitionProgress <= 0) {
                this.exiting = false;
                if (this.exitCallback) this.exitCallback();
            }
            return true;
        }
        return false;
    },

    drawTransition(ctx) {
        if (!this.entering && !this.exiting) return;

        // Pokemon-style battle transition: closing stripes
        const numStripes = 8;
        const stripeH = CANVAS_HEIGHT / numStripes;
        const progress = this.entering ? this.transitionProgress : (1 - this.transitionProgress);

        ctx.fillStyle = '#000';
        for (let i = 0; i < numStripes; i++) {
            const direction = i % 2 === 0 ? 1 : -1;
            const x = direction === 1 ? -CANVAS_WIDTH + CANVAS_WIDTH * progress : CANVAS_WIDTH - CANVAS_WIDTH * progress;
            ctx.fillRect(x, i * stripeH, CANVAS_WIDTH, stripeH);
        }
    },

    draw(ctx) {
        if (!Battle.active) return;

        // Battle background
        ctx.fillStyle = '#e8e8d0';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Ground
        const groundY = CANVAS_HEIGHT * 0.55;
        ctx.fillStyle = '#c8d0a8';
        ctx.fillRect(0, groundY, CANVAS_WIDTH, CANVAS_HEIGHT - groundY);

        // Draw enemy platform
        const enemyPlatX = CANVAS_WIDTH * 0.6 + Battle.enemySlideX;
        const enemyPlatY = CANVAS_HEIGHT * 0.25;
        this._drawPlatform(ctx, enemyPlatX, enemyPlatY + 16 * SCALE, 80 * SCALE, 12 * SCALE);

        // Draw player platform
        const playerPlatX = CANVAS_WIDTH * 0.15 + Battle.playerSlideX;
        const playerPlatY = CANVAS_HEIGHT * 0.5;
        this._drawPlatform(ctx, playerPlatX, playerPlatY + 16 * SCALE, 80 * SCALE, 12 * SCALE);

        // Draw enemy Pokemon
        if (Battle.enemyPokemon) {
            const enemyX = enemyPlatX + 20 * SCALE;
            const enemyY = enemyPlatY - 8 * SCALE;
            const shake = Battle.enemyShake > 0 ? Math.sin(Battle.enemyShake * 2) * 3 * SCALE : 0;

            if (Battle.enemyPokemon.currentHp > 0) {
                // Flash effect when taking damage
                if (Battle.enemyShake > 0 && Battle.enemyShake % 4 < 2) {
                    ctx.globalAlpha = 0.5;
                }
                const spriteData = PokemonSprites.getSprite(Battle.enemyPokemon.speciesId, 'front');
                SpriteRenderer.draw(ctx, spriteData.sprite, enemyX + shake, enemyY, SCALE * 2.5, spriteData.palette);
                ctx.globalAlpha = 1;
            }
        }

        // Draw player Pokemon (back sprite)
        if (Battle.playerPokemon) {
            const playerX = playerPlatX + 10 * SCALE;
            const playerY = playerPlatY - 20 * SCALE;
            const shake = Battle.playerShake > 0 ? Math.sin(Battle.playerShake * 2) * 3 * SCALE : 0;

            if (Battle.playerPokemon.currentHp > 0) {
                if (Battle.playerShake > 0 && Battle.playerShake % 4 < 2) {
                    ctx.globalAlpha = 0.5;
                }
                const spriteData = PokemonSprites.getSprite(Battle.playerPokemon.speciesId, 'back');
                SpriteRenderer.draw(ctx, spriteData.sprite, playerX + shake, playerY, SCALE * 2.5, spriteData.palette);
                ctx.globalAlpha = 1;
            }
        }

        // Draw catch animation
        if (Battle.catchAnim) {
            this._drawCatchAnim(ctx, enemyPlatX + 30 * SCALE, enemyPlatY);
        }

        // Draw enemy info box (top left)
        this._drawEnemyInfoBox(ctx);

        // Draw player info box (bottom right)
        this._drawPlayerInfoBox(ctx);

        // Draw action menu or text
        this._drawBattleMenu(ctx);
    },

    _drawPlatform(ctx, x, y, w, h) {
        ctx.fillStyle = '#90a868';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#708848';
        ctx.lineWidth = 2;
        ctx.stroke();
    },

    _drawEnemyInfoBox(ctx) {
        if (!Battle.enemyPokemon) return;
        const p = Battle.enemyPokemon;
        const x = 8 * SCALE;
        const y = 8 * SCALE;
        const w = 140 * SCALE;
        const h = 36 * SCALE;

        SpriteRenderer.drawBox(ctx, x, y, w, h);

        // Name and level
        const displayName = (Battle.isTrainerBattle ? '' : '') + p.name;
        SpriteRenderer.drawText(ctx, displayName, x + 6 * SCALE, y + 4 * SCALE, 7 * SCALE, COLORS.TEXT);
        SpriteRenderer.drawText(ctx, `Lv${p.level}`, x + w - 35 * SCALE, y + 4 * SCALE, 6 * SCALE, COLORS.TEXT);

        // Status
        if (p.status) {
            this._drawStatus(ctx, x + 6 * SCALE, y + 14 * SCALE, p.status);
        }

        // HP Bar
        const hpBarX = x + 30 * SCALE;
        const hpBarY = y + 22 * SCALE;
        const hpBarW = w - 40 * SCALE;
        SpriteRenderer.drawText(ctx, 'HP', x + 6 * SCALE, y + 19 * SCALE, 6 * SCALE, COLORS.YELLOW);
        SpriteRenderer.drawHPBar(ctx, hpBarX, hpBarY, hpBarW, 4 * SCALE, p.currentHp / p.maxHp);
    },

    _drawPlayerInfoBox(ctx) {
        if (!Battle.playerPokemon) return;
        const p = Battle.playerPokemon;
        const w = 150 * SCALE;
        const h = 48 * SCALE;
        const x = CANVAS_WIDTH - w - 8 * SCALE;
        const y = CANVAS_HEIGHT * 0.52;

        SpriteRenderer.drawBox(ctx, x, y, w, h);

        // Name and level
        SpriteRenderer.drawText(ctx, p.nickname || p.name, x + 6 * SCALE, y + 4 * SCALE, 7 * SCALE, COLORS.TEXT);
        SpriteRenderer.drawText(ctx, `Lv${p.level}`, x + w - 35 * SCALE, y + 4 * SCALE, 6 * SCALE, COLORS.TEXT);

        // Status
        if (p.status) {
            this._drawStatus(ctx, x + 6 * SCALE, y + 14 * SCALE, p.status);
        }

        // HP Bar
        const hpBarX = x + 30 * SCALE;
        const hpBarY = y + 22 * SCALE;
        const hpBarW = w - 40 * SCALE;
        SpriteRenderer.drawText(ctx, 'HP', x + 6 * SCALE, y + 19 * SCALE, 6 * SCALE, COLORS.YELLOW);
        SpriteRenderer.drawHPBar(ctx, hpBarX, hpBarY, hpBarW, 4 * SCALE, p.currentHp / p.maxHp);

        // HP numbers
        SpriteRenderer.drawText(ctx, `${p.currentHp}/${p.maxHp}`,
            x + w - 60 * SCALE, y + 28 * SCALE, 6 * SCALE, COLORS.TEXT);

        // EXP bar
        const expRatio = p.expToNext > 0 ?
            (p.currentExp - Utils.expForLevel(p.level)) / (p.expToNext - Utils.expForLevel(p.level)) : 0;
        SpriteRenderer.drawText(ctx, 'EXP', x + 6 * SCALE, y + 37 * SCALE, 5 * SCALE, COLORS.EXP_BLUE);
        SpriteRenderer.drawExpBar(ctx, x + 25 * SCALE, y + 39 * SCALE, w - 35 * SCALE, 3 * SCALE, Math.max(0, Math.min(1, expRatio)));
    },

    _drawStatus(ctx, x, y, status) {
        const statusColors = {
            poison: '#a040a0',
            burn: '#f08030',
            paralyze: '#f8d030',
            freeze: '#98d8d8',
            sleep: '#a8a878'
        };
        const statusText = {
            poison: 'PSN',
            burn: 'BRN',
            paralyze: 'PAR',
            freeze: 'FRZ',
            sleep: 'SLP'
        };

        if (statusColors[status]) {
            ctx.fillStyle = statusColors[status];
            ctx.fillRect(x, y, 20 * SCALE, 7 * SCALE);
            SpriteRenderer.drawText(ctx, statusText[status], x + 2 * SCALE, y + 1 * SCALE, 5 * SCALE, '#fff');
        }
    },

    _drawBattleMenu(ctx) {
        const menuY = CANVAS_HEIGHT - 50 * SCALE;
        const menuH = 50 * SCALE;

        // Text area
        SpriteRenderer.drawBox(ctx, 0, menuY, CANVAS_WIDTH, menuH);

        if (Battle.state === BATTLE_STATE.TEXT || Battle.state === BATTLE_STATE.INTRO ||
            Battle.state === BATTLE_STATE.RUN || Battle.state === BATTLE_STATE.CATCH ||
            Battle.state === BATTLE_STATE.FAINT || Battle.state === BATTLE_STATE.VICTORY ||
            Battle.state === BATTLE_STATE.DEFEAT) {
            // Show text
            const text = Battle.currentText.substring(0, Battle.textCharIndex);
            SpriteRenderer.drawText(ctx, text, 12 * SCALE, menuY + 10 * SCALE, 7 * SCALE, COLORS.TEXT, CANVAS_WIDTH - 24 * SCALE);

            // Continuation arrow
            if (Battle.textCharIndex >= Battle.currentText.length) {
                const arrowY = menuY + menuH - 12 * SCALE + Math.sin(Date.now() / 200) * 2 * SCALE;
                SpriteRenderer.drawText(ctx, '\u25BC', CANVAS_WIDTH - 16 * SCALE, arrowY, 7 * SCALE, COLORS.TEXT);
            }
        }
        else if (Battle.state === BATTLE_STATE.ACTION_SELECT) {
            // "What will X do?"
            SpriteRenderer.drawText(ctx, `What will ${Battle.playerPokemon.name} do?`,
                12 * SCALE, menuY + 10 * SCALE, 7 * SCALE, COLORS.TEXT);

            // Action buttons
            const btnW = 65 * SCALE;
            const btnH = 18 * SCALE;
            const btnX = CANVAS_WIDTH - btnW * 2 - 8 * SCALE;
            const btnY = menuY + 4 * SCALE;

            const actions = ['FIGHT', 'BAG', 'POKEMON', 'RUN'];
            const colors = ['#e04040', '#e09030', '#50a0e0', '#60b060'];

            actions.forEach((action, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const ax = btnX + col * (btnW + 2 * SCALE);
                const ay = btnY + row * (btnH + 2 * SCALE);

                ctx.fillStyle = i === Battle.actionIndex ? colors[i] : '#c0c0c0';
                ctx.fillRect(ax, ay, btnW, btnH);
                ctx.fillStyle = '#404040';
                ctx.fillRect(ax + 1, ay + 1, btnW - 2, btnH - 2);
                ctx.fillStyle = i === Battle.actionIndex ? colors[i] : '#808080';
                ctx.fillRect(ax + 2, ay + 2, btnW - 4, btnH - 4);

                SpriteRenderer.drawText(ctx, action, ax + 8 * SCALE, ay + 4 * SCALE, 6 * SCALE,
                    i === Battle.actionIndex ? '#fff' : '#ddd');
            });
        }
        else if (Battle.state === BATTLE_STATE.MOVE_SELECT) {
            // Move list
            const moves = Battle.playerPokemon.moves;
            moves.forEach((move, i) => {
                const mx = (i % 2 === 0 ? 12 : CANVAS_WIDTH / 2 + 6) * SCALE;
                const my = menuY + (Math.floor(i / 2) * 18 + 6) * SCALE;

                if (i === Battle.moveIndex) {
                    SpriteRenderer.drawText(ctx, '\u25B6', mx - 8 * SCALE, my, 6 * SCALE, COLORS.TEXT);
                }

                const color = move.currentPp > 0 ? COLORS.TEXT : COLORS.RED;
                SpriteRenderer.drawText(ctx, move.name, mx, my, 6 * SCALE, color);
                SpriteRenderer.drawText(ctx, `${move.currentPp}/${move.maxPp}`,
                    mx + 55 * SCALE, my, 5 * SCALE, color);
            });

            // Move info panel
            if (moves[Battle.moveIndex]) {
                const move = moves[Battle.moveIndex];
                const infoX = CANVAS_WIDTH - 70 * SCALE;
                SpriteRenderer.drawText(ctx, `TYPE/${move.type}`, infoX, menuY + 6 * SCALE, 5 * SCALE, TYPE_COLORS[move.type] || COLORS.TEXT);
                if (move.power > 0) {
                    SpriteRenderer.drawText(ctx, `PWR/${move.power}`, infoX, menuY + 16 * SCALE, 5 * SCALE, COLORS.TEXT);
                }
                SpriteRenderer.drawText(ctx, `ACC/${move.accuracy}`, infoX, menuY + 26 * SCALE, 5 * SCALE, COLORS.TEXT);
            }
        }
    },

    _drawCatchAnim(ctx, x, y) {
        const anim = Battle.catchAnim;
        const progress = anim.timer / anim.duration;

        // Draw pokeball
        const ballSize = 8 * SCALE;
        const bounceY = y + Math.sin(progress * Math.PI) * -30 * SCALE;

        ctx.fillStyle = '#e03030';
        ctx.beginPath();
        ctx.arc(x, bounceY, ballSize, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#f8f8f8';
        ctx.beginPath();
        ctx.arc(x, bounceY, ballSize, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#282828';
        ctx.fillRect(x - ballSize, bounceY - 1 * SCALE, ballSize * 2, 2 * SCALE);
        ctx.beginPath();
        ctx.arc(x, bounceY, 3 * SCALE, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8f8f8';
        ctx.beginPath();
        ctx.arc(x, bounceY, 2 * SCALE, 0, Math.PI * 2);
        ctx.fill();

        // Shake animation
        if (progress > 0.5) {
            const shakePhase = Math.floor((progress - 0.5) * 6);
            if (shakePhase < anim.shakes.length && anim.shakes[shakePhase]) {
                Audio.playSfx('pokeball_shake');
            }
        }
    }
};

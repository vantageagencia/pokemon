// Main Game Controller
const Game = {
    canvas: null,
    ctx: null,
    state: STATE.TITLE,
    currentMap: null,
    transitionState: null,
    transitionTimer: 0,
    pendingWarp: null,
    frameCount: 0,
    pendingItemUse: null,

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        // Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;

        Input.init();
        Audio.init();
        Inventory.init();
        TitleScreen.init();

        // Start game loop
        this.lastTime = performance.now();
        this.accumulator = 0;
        requestAnimationFrame(this._loop.bind(this));
    },

    _loop(currentTime) {
        requestAnimationFrame(this._loop.bind(this));

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulator += deltaTime;

        // Fixed timestep update
        while (this.accumulator >= FRAME_TIME) {
            Input.update();
            this.update();
            this.accumulator -= FRAME_TIME;
        }

        this.draw();
        this.frameCount++;
    },

    update() {
        // Handle transitions
        if (BattleUI.updateTransition()) return;

        switch (this.state) {
            case STATE.TITLE:
                this._updateTitle();
                break;
            case STATE.OVERWORLD:
                this._updateOverworld();
                break;
            case STATE.BATTLE:
                this._updateBattle();
                break;
            case STATE.MENU:
                this._updateMenu();
                break;
            case STATE.DIALOG:
                this._updateDialog();
                break;
            case STATE.PARTY:
                this._updateParty();
                break;
            case STATE.BAG:
                this._updateBag();
                break;
            case STATE.POKEDEX:
                this._updatePokedex();
                break;
            case STATE.SHOP:
                this._updateShop();
                break;
            case STATE.EVOLUTION:
                EvolutionSystem.update();
                break;
            case STATE.TRANSITION:
                this._updateTransition();
                break;
        }
    },

    _updateTitle() {
        const result = TitleScreen.update();
        if (result === 'new_game') {
            this._startNewGame();
        } else if (result === 'continue') {
            this._loadGame();
        }
    },

    _startNewGame() {
        TitleScreen.active = false;
        Audio.stopMusic();

        Player.init('oak_lab', 5, 8);
        Player.name = 'Red';
        Player.money = 3000;
        Player.badges = [];
        Player.party = [];
        Player.pc = [];
        Player.pokedex = { seen: new Set(), caught: new Set() };
        Player.hasStarter = false;
        Inventory.init();

        // Reset trainers
        Object.keys(TrainerDB).forEach(key => { TrainerDB[key].defeated = false; });

        this.currentMap = Maps.oak_lab;
        Camera.snapTo(Player.pixelX, Player.pixelY, this.currentMap.width, this.currentMap.height);
        this.state = STATE.OVERWORLD;
        Audio.playMusic(this.currentMap.music);

        TextBox.show("Welcome to the world of Pokemon! Talk to Prof. Oak to receive your first Pokemon!");
        this.state = STATE.DIALOG;
    },

    _loadGame() {
        if (SaveSystem.load()) {
            TitleScreen.active = false;
            Audio.stopMusic();
            this.currentMap = Maps[Player.currentMap];
            Camera.snapTo(Player.pixelX, Player.pixelY, this.currentMap.width, this.currentMap.height);
            this.state = STATE.OVERWORLD;
            Audio.playMusic(this.currentMap.music);
        }
    },

    _updateOverworld() {
        if (TextBox.active) {
            TextBox.update();
            return;
        }

        // Open start menu
        if (Input.start) {
            MenuUI.open();
            this.state = STATE.MENU;
            return;
        }

        // Player movement and interaction
        const result = Player.update(this.currentMap);
        Camera.update(Player.pixelX, Player.pixelY, this.currentMap.width, this.currentMap.height);

        if (result) {
            this._handleOverworldEvent(result);
        }
    },

    _handleOverworldEvent(event) {
        switch (event.type) {
            case 'warp':
                this._startWarp(event.warp);
                break;

            case 'wild_encounter':
                this._startWildBattle();
                break;

            case 'npc':
                NPCSystem.interact(event.npc, this);
                if (TextBox.active) this.state = STATE.DIALOG;
                break;

            case 'sign':
                TextBox.show(event.sign.text);
                this.state = STATE.DIALOG;
                break;

            case 'pc':
                TextBox.show("Accessing the PC... (PC storage coming soon!)");
                this.state = STATE.DIALOG;
                break;
        }
    },

    _startWarp(warp) {
        Audio.playSfx('door');
        this.pendingWarp = warp;
        this.transitionState = 'out';
        this.transitionTimer = 0;
        this.state = STATE.TRANSITION;
    },

    _updateTransition() {
        this.transitionTimer++;

        if (this.transitionState === 'out') {
            if (this.transitionTimer >= 15) {
                // Execute warp
                if (this.pendingWarp) {
                    const targetMap = Maps[this.pendingWarp.targetMap];
                    if (targetMap) {
                        Player.currentMap = this.pendingWarp.targetMap;
                        this.currentMap = targetMap;
                        Player.x = this.pendingWarp.targetX;
                        Player.y = this.pendingWarp.targetY;
                        Player.pixelX = Player.x * SCALED_TILE;
                        Player.pixelY = Player.y * SCALED_TILE;
                        Camera.snapTo(Player.pixelX, Player.pixelY, targetMap.width, targetMap.height);

                        // Change music if different
                        if (targetMap.music) {
                            Audio.playMusic(targetMap.music);
                        }
                    }
                    this.pendingWarp = null;
                }
                this.transitionState = 'in';
                this.transitionTimer = 0;
            }
        } else if (this.transitionState === 'in') {
            if (this.transitionTimer >= 15) {
                this.state = STATE.OVERWORLD;
                this.transitionState = null;
            }
        }
    },

    _startWildBattle() {
        if (Player.party.length === 0 || Player.getAlivePartyCount() === 0) return;

        const wildPokemon = WildEncounter.generate(this.currentMap);
        if (!wildPokemon) return;

        BattleUI.startTransition(() => {
            Battle.start(wildPokemon, false, null, (won, ran) => {
                BattleUI.startExitTransition(() => {
                    this.state = STATE.OVERWORLD;
                    Audio.playMusic(this.currentMap.music);
                });
            });
            this.state = STATE.BATTLE;
        });
    },

    startTrainerBattle(trainerData, trainerId) {
        if (Player.party.length === 0 || Player.getAlivePartyCount() === 0) return;

        BattleUI.startTransition(() => {
            Battle.start(null, true, trainerData, (won) => {
                if (won) {
                    trainerData.defeated = true;
                    TextBox.show(trainerData.defeatText, () => {
                        if (trainerData.reward) {
                            TextBox.show(`You received $${trainerData.reward} for winning!`, () => {
                                if (trainerData.badge) {
                                    TextBox.show(`You received the ${trainerData.badge}!`);
                                }
                            });
                        }
                    });
                    this.state = STATE.DIALOG;
                } else {
                    this.state = STATE.OVERWORLD;
                }
                BattleUI.startExitTransition(() => {
                    Audio.playMusic(this.currentMap.music);
                });
            });
            this.state = STATE.BATTLE;
        });
    },

    openShop(shopItems) {
        ShopUI.open(shopItems);
        this.state = STATE.SHOP;
    },

    _updateBattle() {
        // Check if sub-UIs are active
        if (Battle.state === BATTLE_STATE.ITEM_SELECT) {
            if (!BagUI.active) {
                BagUI.open('battle');
            }
            const result = BagUI.update();
            if (result === 'close') {
                Battle.state = BATTLE_STATE.ACTION_SELECT;
            }
            return;
        }

        if (Battle.state === BATTLE_STATE.SWITCH_SELECT) {
            if (!PartyUI.active) {
                PartyUI.open('battle_switch', (index) => {
                    Battle.switchPokemon(index);
                });
            }
            const result = PartyUI.update();
            if (result === 'close') {
                // Only go back to action select if player still has alive pokemon and chose cancel
                if (Player.getAlivePartyCount() > 0 && Battle.playerPokemon.currentHp > 0) {
                    Battle.state = BATTLE_STATE.ACTION_SELECT;
                }
            }
            return;
        }

        Battle.update();

        // Check if battle ended
        if (!Battle.active) {
            if (Battle.state !== BATTLE_STATE.RUN) {
                // Check for defeat
                if (Player.getAlivePartyCount() === 0) {
                    TextBox.show("You rushed to the nearest Pokemon Center...", () => {
                        Player.healParty();
                        // Warp to last Pokemon Center or home
                        Player.currentMap = 'pokemon_center';
                        this.currentMap = Maps.pokemon_center;
                        Player.x = 4;
                        Player.y = 4;
                        Player.pixelX = Player.x * SCALED_TILE;
                        Player.pixelY = Player.y * SCALED_TILE;
                        Camera.snapTo(Player.pixelX, Player.pixelY, this.currentMap.width, this.currentMap.height);
                        this.state = STATE.OVERWORLD;
                        Audio.playMusic('pokemon_center');
                    });
                    this.state = STATE.DIALOG;
                }
            }
        }
    },

    _updateMenu() {
        const result = MenuUI.update();
        if (!result) return;

        switch (result) {
            case 'close':
                this.state = STATE.OVERWORLD;
                break;
            case 'pokemon':
                MenuUI.close();
                PartyUI.open('view');
                this.state = STATE.PARTY;
                break;
            case 'bag':
                MenuUI.close();
                BagUI.open('menu');
                this.state = STATE.BAG;
                break;
            case 'pokedex':
                MenuUI.close();
                PokedexUI.open();
                this.state = STATE.POKEDEX;
                break;
            case 'save':
                MenuUI.close();
                if (SaveSystem.save()) {
                    Audio.playSfx('save');
                    TextBox.show("Game saved successfully!");
                    this.state = STATE.DIALOG;
                } else {
                    TextBox.show("Save failed!");
                    this.state = STATE.DIALOG;
                }
                break;
            case 'options':
                MenuUI.close();
                TextBox.show("Options: Press Z to toggle sound on/off.", () => {
                    Audio.enabled = !Audio.enabled;
                    TextBox.show(`Sound is now ${Audio.enabled ? 'ON' : 'OFF'}.`);
                });
                this.state = STATE.DIALOG;
                break;
        }
    },

    _updateDialog() {
        TextBox.update();
        if (!TextBox.active) {
            this.state = STATE.OVERWORLD;
        }
    },

    _updateParty() {
        const result = PartyUI.update();
        if (result === 'close') {
            if (this.pendingItemUse) {
                // Was using an item from bag
                this.pendingItemUse = null;
                BagUI.open('menu');
                this.state = STATE.BAG;
            } else {
                this.state = STATE.OVERWORLD;
            }
        } else if (result === 'item_used') {
            // Item was used on pokemon from the callback
        }
    },

    _updateBag() {
        const result = BagUI.update();
        if (result === 'close') {
            this.state = STATE.OVERWORLD;
        } else if (result && result.type === 'use_on_pokemon') {
            this.pendingItemUse = result.item;
            PartyUI.open('item_use', (pokemonIndex) => {
                if (BagUI.useItemOnPokemon(this.pendingItemUse, pokemonIndex)) {
                    TextBox.show(`Used ${this.pendingItemUse.data.name}!`);
                } else {
                    TextBox.show("It won't have any effect.");
                }
                this.pendingItemUse = null;
                PartyUI.close();
                this.state = STATE.DIALOG;
            });
            this.state = STATE.PARTY;
        }
    },

    _updatePokedex() {
        const result = PokedexUI.update();
        if (result === 'close') {
            this.state = STATE.OVERWORLD;
        }
    },

    _updateShop() {
        const result = ShopUI.update();
        if (result === 'close') {
            this.state = STATE.OVERWORLD;
        }
    },

    // ========== DRAW ==========

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.imageSmoothingEnabled = false;

        switch (this.state) {
            case STATE.TITLE:
                TitleScreen.draw(ctx);
                break;

            case STATE.OVERWORLD:
            case STATE.MENU:
            case STATE.DIALOG:
                this._drawOverworld(ctx);
                if (this.state === STATE.MENU) MenuUI.draw(ctx);
                if (TextBox.active) TextBox.draw(ctx);
                break;

            case STATE.BATTLE:
                BattleUI.draw(ctx);
                if (BagUI.active) BagUI.draw(ctx);
                if (PartyUI.active) PartyUI.draw(ctx);
                break;

            case STATE.PARTY:
                PartyUI.draw(ctx);
                if (TextBox.active) TextBox.draw(ctx);
                break;

            case STATE.BAG:
                BagUI.draw(ctx);
                break;

            case STATE.POKEDEX:
                PokedexUI.draw(ctx);
                break;

            case STATE.SHOP:
                ShopUI.draw(ctx);
                break;

            case STATE.EVOLUTION:
                EvolutionSystem.draw(ctx);
                break;

            case STATE.TRANSITION:
                this._drawOverworld(ctx);
                this._drawTransition(ctx);
                break;
        }

        // Battle transition overlay
        BattleUI.drawTransition(ctx);
    },

    _drawOverworld(ctx) {
        if (!this.currentMap) return;

        // Draw map
        MapRenderer.draw(ctx, this.currentMap);

        // Draw NPCs
        NPCSystem.draw(ctx, this.currentMap.npcs);

        // Draw player
        Player.draw(ctx);

        // Draw above-player layers
        MapRenderer.drawAbovePlayer(ctx, this.currentMap);

        // Draw map name when entering new area
        this._drawMapName(ctx);
    },

    _drawTransition(ctx) {
        let alpha;
        if (this.transitionState === 'out') {
            alpha = this.transitionTimer / 15;
        } else {
            alpha = 1 - this.transitionTimer / 15;
        }
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    },

    _drawMapName(ctx) {
        // Show map name briefly on entering
        if (this.transitionState === 'in' && this.currentMap) {
            const alpha = 1 - this.transitionTimer / 15;
            if (alpha > 0) {
                ctx.globalAlpha = alpha;
                SpriteRenderer.drawBox(ctx, CANVAS_WIDTH / 2 - 60 * SCALE, 8 * SCALE, 120 * SCALE, 16 * SCALE);
                SpriteRenderer.drawText(ctx, this.currentMap.name,
                    CANVAS_WIDTH / 2 - 50 * SCALE, 12 * SCALE, 7 * SCALE, COLORS.TEXT);
                ctx.globalAlpha = 1;
            }
        }
    }
};

// Start the game
window.addEventListener('load', () => {
    Game.init();
});

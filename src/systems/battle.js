// Battle system
const Battle = {
    active: false,
    state: BATTLE_STATE.INTRO,
    isTrainerBattle: false,
    trainerData: null,

    playerPokemon: null,
    enemyPokemon: null,
    playerPartyIndex: 0,
    enemyParty: [],
    enemyPartyIndex: 0,

    // UI state
    actionIndex: 0,
    moveIndex: 0,
    textQueue: [],
    currentText: '',
    textCharIndex: 0,
    textTimer: 0,
    waitingForInput: false,

    // Animation
    animTimer: 0,
    animPhase: 0,
    playerSlideX: 0,
    enemySlideX: 0,
    playerShake: 0,
    enemyShake: 0,
    flashTimer: 0,
    expBarAnimating: false,
    catchAnim: null,

    // Callbacks
    onEnd: null,
    pendingLevelUps: [],
    pendingEvolutions: [],
    pendingNewMoves: [],

    start(wildPokemon, isTrainer = false, trainerData = null, callback = null) {
        this.active = true;
        this.isTrainerBattle = isTrainer;
        this.trainerData = trainerData;
        this.onEnd = callback;

        if (isTrainer && trainerData) {
            this.enemyParty = trainerData.pokemon.map(p =>
                PokemonFactory.create(p.species, p.level, false)
            );
        } else {
            this.enemyParty = [wildPokemon];
        }

        this.enemyPartyIndex = 0;
        this.enemyPokemon = this.enemyParty[0];
        Player.pokedex.seen.add(this.enemyPokemon.speciesId);

        this.playerPartyIndex = Player.party.findIndex(p => p.currentHp > 0);
        this.playerPokemon = Player.party[this.playerPartyIndex];

        // Reset stat stages
        PokemonFactory.resetStatStages(this.playerPokemon);
        PokemonFactory.resetStatStages(this.enemyPokemon);

        this.state = BATTLE_STATE.INTRO;
        this.actionIndex = 0;
        this.moveIndex = 0;
        this.textQueue = [];
        this.pendingLevelUps = [];
        this.pendingEvolutions = [];
        this.pendingNewMoves = [];

        // Intro animation
        this.playerSlideX = -CANVAS_WIDTH;
        this.enemySlideX = CANVAS_WIDTH;
        this.animTimer = 0;
        this.animPhase = 0;

        if (isTrainer) {
            Audio.playMusic('trainer_battle');
            this._queueText(`${trainerData.class} ${trainerData.name} wants to battle!`);
            this._queueText(`${trainerData.class} ${trainerData.name} sent out ${this.enemyPokemon.name}!`);
        } else {
            Audio.playMusic('battle');
            this._queueText(`Wild ${this.enemyPokemon.name} appeared!`);
        }
        this._queueText(`Go! ${this.playerPokemon.name}!`);

        Audio.playSfx('encounter');
    },

    update() {
        if (!this.active) return;

        this._updateAnimations();

        switch (this.state) {
            case BATTLE_STATE.INTRO:
                this._updateIntro();
                break;
            case BATTLE_STATE.TEXT:
                this._updateText();
                break;
            case BATTLE_STATE.ACTION_SELECT:
                this._updateActionSelect();
                break;
            case BATTLE_STATE.MOVE_SELECT:
                this._updateMoveSelect();
                break;
            case BATTLE_STATE.EXECUTING:
                this._executeTurn();
                break;
            case BATTLE_STATE.FAINT:
                this._updateFaint();
                break;
            case BATTLE_STATE.EXP:
                this._updateExp();
                break;
            case BATTLE_STATE.LEVEL_UP:
                this._updateLevelUp();
                break;
            case BATTLE_STATE.LEARN_MOVE:
                this._updateLearnMove();
                break;
            case BATTLE_STATE.VICTORY:
                this._updateVictory();
                break;
            case BATTLE_STATE.DEFEAT:
                this._updateDefeat();
                break;
            case BATTLE_STATE.CATCH:
                this._updateCatch();
                break;
            case BATTLE_STATE.ITEM_SELECT:
                // Handled by BagUI
                break;
            case BATTLE_STATE.SWITCH_SELECT:
                // Handled by PartyUI
                break;
            case BATTLE_STATE.RUN:
                this._updateRun();
                break;
        }
    },

    _updateAnimations() {
        // Slide in animation
        if (this.state === BATTLE_STATE.INTRO) {
            this.playerSlideX = Utils.lerp(this.playerSlideX, 0, 0.1);
            this.enemySlideX = Utils.lerp(this.enemySlideX, 0, 0.1);
        }

        // Shake animation
        if (this.playerShake > 0) this.playerShake--;
        if (this.enemyShake > 0) this.enemyShake--;
        if (this.flashTimer > 0) this.flashTimer--;
    },

    _updateIntro() {
        this.animTimer++;
        if (this.animTimer > 30) {
            if (Math.abs(this.playerSlideX) < 1 && Math.abs(this.enemySlideX) < 1) {
                this.playerSlideX = 0;
                this.enemySlideX = 0;
                this.state = BATTLE_STATE.TEXT;
                this._showNextText();
            }
        }
    },

    _updateText() {
        // Animate text typing
        if (this.textCharIndex < this.currentText.length) {
            this.textTimer++;
            const speed = Input.isDown('KeyZ') ? 1 : 2;
            if (this.textTimer >= speed) {
                this.textTimer = 0;
                this.textCharIndex++;
                if (this.textCharIndex % 2 === 0) Audio.playSfx('text');
            }

            if (Input.confirm && this.textCharIndex < this.currentText.length) {
                this.textCharIndex = this.currentText.length;
            }
        } else if (Input.confirm || Input.cancel) {
            if (this.textQueue.length > 0) {
                this._showNextText();
            } else {
                // Text done, go to next state
                this._afterText();
            }
        }
    },

    _afterText() {
        // Check for pending operations
        if (this.enemyPokemon && this.enemyPokemon.currentHp <= 0) {
            this.state = BATTLE_STATE.FAINT;
            this._handleEnemyFaint();
            return;
        }
        if (this.playerPokemon && this.playerPokemon.currentHp <= 0) {
            this.state = BATTLE_STATE.FAINT;
            this._handlePlayerFaint();
            return;
        }
        if (this.pendingNewMoves.length > 0) {
            this.state = BATTLE_STATE.LEARN_MOVE;
            return;
        }
        if (this.pendingEvolutions.length > 0) {
            this._handleEvolution();
            return;
        }

        this.state = BATTLE_STATE.ACTION_SELECT;
        this.actionIndex = 0;
    },

    _updateActionSelect() {
        if (Input.downPressed) {
            this.actionIndex = (this.actionIndex + 2) % 4;
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.actionIndex = (this.actionIndex - 2 + 4) % 4;
            Audio.playSfx('select');
        }
        if (Input.rightPressed) {
            this.actionIndex = this.actionIndex % 2 === 0 ? this.actionIndex + 1 : this.actionIndex - 1;
            Audio.playSfx('select');
        }
        if (Input.leftPressed) {
            this.actionIndex = this.actionIndex % 2 === 0 ? this.actionIndex + 1 : this.actionIndex - 1;
            Audio.playSfx('select');
        }

        if (Input.confirm) {
            Audio.playSfx('confirm');
            switch (this.actionIndex) {
                case 0: // Fight
                    this.state = BATTLE_STATE.MOVE_SELECT;
                    this.moveIndex = 0;
                    break;
                case 1: // Bag
                    this.state = BATTLE_STATE.ITEM_SELECT;
                    break;
                case 2: // Pokemon
                    this.state = BATTLE_STATE.SWITCH_SELECT;
                    break;
                case 3: // Run
                    this._tryRun();
                    break;
            }
        }
    },

    _updateMoveSelect() {
        const moveCount = this.playerPokemon.moves.length;
        if (Input.downPressed) {
            this.moveIndex = (this.moveIndex + 1) % moveCount;
            Audio.playSfx('select');
        }
        if (Input.upPressed) {
            this.moveIndex = (this.moveIndex - 1 + moveCount) % moveCount;
            Audio.playSfx('select');
        }
        if (Input.cancel) {
            Audio.playSfx('cancel');
            this.state = BATTLE_STATE.ACTION_SELECT;
            return;
        }
        if (Input.confirm) {
            const move = this.playerPokemon.moves[this.moveIndex];
            if (move.currentPp <= 0) {
                Audio.playSfx('bump');
                return;
            }
            Audio.playSfx('confirm');
            this.selectedPlayerMove = this.moveIndex;
            this.state = BATTLE_STATE.EXECUTING;
        }
    },

    _executeTurn() {
        const playerMove = this.playerPokemon.moves[this.selectedPlayerMove];
        const enemyMove = this._selectEnemyMove();

        // Determine order
        const playerSpeed = PokemonFactory.getEffectiveStat(this.playerPokemon, 'speed');
        const enemySpeed = PokemonFactory.getEffectiveStat(this.enemyPokemon, 'speed');
        const playerPriority = playerMove.priority || 0;
        const enemyPriority = enemyMove.priority || 0;

        let playerFirst;
        if (playerPriority !== enemyPriority) {
            playerFirst = playerPriority > enemyPriority;
        } else if (playerSpeed !== enemySpeed) {
            playerFirst = playerSpeed > enemySpeed;
        } else {
            playerFirst = Utils.chance(50);
        }

        // Check paralysis
        const playerParalyzed = this.playerPokemon.status === 'paralyze' && Utils.chance(25);
        const enemyParalyzed = this.enemyPokemon.status === 'paralyze' && Utils.chance(25);

        // Check sleep
        const playerAsleep = this.playerPokemon.status === 'sleep';
        const enemyAsleep = this.enemyPokemon.status === 'sleep';

        // Check freeze
        const playerFrozen = this.playerPokemon.status === 'freeze';
        const enemyFrozen = this.enemyPokemon.status === 'freeze';

        this.textQueue = [];

        if (playerFirst) {
            this._executeMove(this.playerPokemon, this.enemyPokemon, playerMove, true, playerParalyzed, playerAsleep, playerFrozen);
            if (this.enemyPokemon.currentHp > 0 && this.playerPokemon.currentHp > 0) {
                this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, enemyParalyzed, enemyAsleep, enemyFrozen);
            }
        } else {
            this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, enemyParalyzed, enemyAsleep, enemyFrozen);
            if (this.playerPokemon.currentHp > 0 && this.enemyPokemon.currentHp > 0) {
                this._executeMove(this.playerPokemon, this.enemyPokemon, playerMove, true, playerParalyzed, playerAsleep, playerFrozen);
            }
        }

        // End of turn effects
        this._endOfTurnEffects();

        this.state = BATTLE_STATE.TEXT;
        this._showNextText();
    },

    _executeMove(attacker, defender, move, isPlayer, paralyzed, asleep, frozen) {
        const attackerName = isPlayer ? attacker.name : `Wild ${attacker.name}`;
        const defenderName = isPlayer ? `Wild ${defender.name}` : defender.name;

        // Check status conditions
        if (frozen) {
            if (Utils.chance(20)) {
                attacker.status = null;
                this._queueText(`${attackerName} thawed out!`);
            } else {
                this._queueText(`${attackerName} is frozen solid!`);
                return;
            }
        }

        if (asleep) {
            attacker.statusTurns--;
            if (attacker.statusTurns <= 0) {
                attacker.status = null;
                this._queueText(`${attackerName} woke up!`);
            } else {
                this._queueText(`${attackerName} is fast asleep!`);
                return;
            }
        }

        if (paralyzed) {
            this._queueText(`${attackerName} is paralyzed! It can't move!`);
            return;
        }

        this._queueText(`${attackerName} used ${move.name}!`);
        move.currentPp = Math.max(0, move.currentPp - 1);

        // Status moves
        if (move.category === MOVE_CATEGORY.STATUS) {
            this._handleStatusMove(attacker, defender, move, isPlayer);
            return;
        }

        // Check accuracy
        if (!this._checkAccuracy(attacker, defender, move)) {
            this._queueText(`${attackerName}'s attack missed!`);
            return;
        }

        // Calculate damage
        const damage = this._calcDamage(attacker, defender, move);

        // Apply damage
        defender.currentHp = Math.max(0, defender.currentHp - damage.amount);

        // Hit animation
        if (isPlayer) {
            this.enemyShake = 15;
        } else {
            this.playerShake = 15;
        }

        // Effectiveness text
        if (damage.effectiveness > 1) {
            this._queueText("It's super effective!");
            Audio.playSfx('super_effective');
        } else if (damage.effectiveness < 1 && damage.effectiveness > 0) {
            this._queueText("It's not very effective...");
            Audio.playSfx('not_effective');
        } else if (damage.effectiveness === 0) {
            this._queueText(`It doesn't affect ${defenderName}...`);
            return;
        }

        if (damage.critical) {
            this._queueText('A critical hit!');
            Audio.playSfx('critical');
        } else {
            Audio.playSfx('hit');
        }

        // Check move secondary effect
        if (move.effect && move.effect.chance) {
            if (Utils.chance(move.effect.chance)) {
                this._applyEffect(move.effect, attacker, defender, isPlayer);
            }
        }

        // Check faint
        if (defender.currentHp <= 0) {
            this._queueText(`${defenderName} fainted!`);
            Audio.playSfx('faint');
        }
    },

    _handleStatusMove(attacker, defender, move, isPlayer) {
        const attackerName = isPlayer ? attacker.name : `Wild ${attacker.name}`;
        const defenderName = isPlayer ? `Wild ${defender.name}` : defender.name;
        const effect = move.effect;
        if (!effect) return;

        if (effect.type === 'stat_up') {
            const target = effect.target === 'self' ? attacker : defender;
            const targetName = effect.target === 'self' ? attackerName : defenderName;
            const stat = effect.stat;
            const stages = effect.stages;
            target.statStages[stat] = Utils.clamp(target.statStages[stat] + stages, -6, 6);
            const statNames = { attack: 'Attack', defense: 'Defense', spAttack: 'Sp. Atk', spDefense: 'Sp. Def', speed: 'Speed' };
            this._queueText(`${targetName}'s ${statNames[stat]} rose${stages > 1 ? ' sharply' : ''}!`);
        }
        else if (effect.type === 'stat_down') {
            const target = effect.target === 'self' ? attacker : defender;
            const targetName = effect.target === 'self' ? attackerName : defenderName;
            const stat = effect.stat;
            const stages = effect.stages;
            target.statStages[stat] = Utils.clamp(target.statStages[stat] - stages, -6, 6);
            const statNames = { attack: 'Attack', defense: 'Defense', spAttack: 'Sp. Atk', spDefense: 'Sp. Def', speed: 'Speed', accuracy: 'Accuracy' };
            this._queueText(`${targetName}'s ${statNames[stat]} fell${stages > 1 ? ' harshly' : ''}!`);
        }
        else if (effect.type === 'sleep') {
            if (defender.status) {
                this._queueText(`It didn't affect ${defenderName}...`);
            } else {
                defender.status = 'sleep';
                defender.statusTurns = Utils.random(1, 3);
                this._queueText(`${defenderName} fell asleep!`);
            }
        }
        else if (effect.type === 'paralyze') {
            if (defender.status) {
                this._queueText(`It didn't affect ${defenderName}...`);
            } else {
                defender.status = 'paralyze';
                this._queueText(`${defenderName} is paralyzed!`);
            }
        }
        else if (effect.type === 'poison' || effect.type === 'badly_poison') {
            if (defender.status || defender.types.includes('Poison')) {
                this._queueText(`It didn't affect ${defenderName}...`);
            } else {
                defender.status = 'poison';
                defender.statusTurns = 1;
                this._queueText(`${defenderName} was poisoned!`);
            }
        }
        else if (effect.type === 'heal') {
            const healAmount = Math.floor(attacker.maxHp * effect.amount);
            attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount);
            this._queueText(`${attackerName} recovered health!`);
            Audio.playSfx('heal');
        }
        else if (effect.type === 'leech_seed') {
            this._queueText(`${defenderName} was seeded!`);
        }
    },

    _checkAccuracy(attacker, defender, move) {
        if (move.accuracy === 0) return true;
        const accStage = attacker.statStages.accuracy - defender.statStages.evasion;
        const accMult = PokemonFactory.getStatMultiplier(Utils.clamp(accStage, -6, 6));
        return Utils.chance(move.accuracy * accMult);
    },

    _calcDamage(attacker, defender, move) {
        const level = attacker.level;
        let attack, defense;

        if (move.category === MOVE_CATEGORY.PHYSICAL) {
            attack = PokemonFactory.getEffectiveStat(attacker, 'attack');
            defense = PokemonFactory.getEffectiveStat(defender, 'defense');
        } else {
            attack = PokemonFactory.getEffectiveStat(attacker, 'spAttack');
            defense = PokemonFactory.getEffectiveStat(defender, 'spDefense');
        }

        // Fixed damage moves
        if (move.effect && move.effect.type === 'fixed_damage') {
            return { amount: move.effect.damage, effectiveness: 1, critical: false };
        }
        if (move.effect && move.effect.type === 'level_damage') {
            return { amount: attacker.level, effectiveness: 1, critical: false };
        }

        // STAB
        const stab = attacker.types.includes(move.type) ? 1.5 : 1;

        // Type effectiveness
        const effectiveness = TypeChart.getEffectiveness(move.type, defender.types);

        // Critical hit
        const critRate = move.highCrit ? 8 : 16;
        const critical = Utils.random(1, critRate) === 1;
        const critMult = critical ? 1.5 : 1;

        // Random factor
        const random = Utils.random(85, 100) / 100;

        // Burn reduces physical attack
        const burnMod = (attacker.status === 'burn' && move.category === MOVE_CATEGORY.PHYSICAL) ? 0.5 : 1;

        let damage = Math.floor(
            ((2 * level / 5 + 2) * move.power * attack / defense / 50 + 2)
            * stab * effectiveness * critMult * random * burnMod
        );

        damage = Math.max(1, damage);

        return { amount: damage, effectiveness, critical };
    },

    _applyEffect(effect, attacker, defender, isPlayer) {
        const defenderName = isPlayer ? `Wild ${defender.name}` : defender.name;

        switch (effect.type) {
            case 'burn':
                if (!defender.status && !defender.types.includes('Fire')) {
                    defender.status = 'burn';
                    this._queueText(`${defenderName} was burned!`);
                }
                break;
            case 'paralyze':
                if (!defender.status && !defender.types.includes('Electric')) {
                    defender.status = 'paralyze';
                    this._queueText(`${defenderName} is paralyzed!`);
                }
                break;
            case 'poison':
                if (!defender.status && !defender.types.includes('Poison')) {
                    defender.status = 'poison';
                    defender.statusTurns = 1;
                    this._queueText(`${defenderName} was poisoned!`);
                }
                break;
            case 'freeze':
                if (!defender.status && !defender.types.includes('Ice')) {
                    defender.status = 'freeze';
                    this._queueText(`${defenderName} was frozen!`);
                }
                break;
            case 'confuse':
                this._queueText(`${defenderName} became confused!`);
                break;
            case 'flinch':
                // Handled separately
                break;
        }
    },

    _endOfTurnEffects() {
        // Poison/Burn damage
        [
            { p: this.playerPokemon, isPlayer: true },
            { p: this.enemyPokemon, isPlayer: false }
        ].forEach(({ p, isPlayer }) => {
            if (p.currentHp <= 0) return;
            const name = isPlayer ? p.name : `Wild ${p.name}`;

            if (p.status === 'poison') {
                const damage = Math.max(1, Math.floor(p.maxHp / 8));
                p.currentHp = Math.max(0, p.currentHp - damage);
                this._queueText(`${name} is hurt by poison!`);
                if (p.currentHp <= 0) {
                    this._queueText(`${name} fainted!`);
                }
            }
            if (p.status === 'burn') {
                const damage = Math.max(1, Math.floor(p.maxHp / 16));
                p.currentHp = Math.max(0, p.currentHp - damage);
                this._queueText(`${name} is hurt by its burn!`);
                if (p.currentHp <= 0) {
                    this._queueText(`${name} fainted!`);
                }
            }
        });
    },

    _selectEnemyMove() {
        const availableMoves = this.enemyPokemon.moves.filter(m => m.currentPp > 0);
        if (availableMoves.length === 0) {
            // Struggle
            return { name: 'Struggle', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 50, accuracy: 100, currentPp: 1, maxPp: 1, priority: 0 };
        }

        // AI: prefer super-effective moves
        if (this.isTrainerBattle && Utils.chance(70)) {
            const effectiveMoves = availableMoves.filter(m => {
                if (m.category === MOVE_CATEGORY.STATUS) return false;
                const eff = TypeChart.getEffectiveness(m.type, this.playerPokemon.types);
                return eff > 1;
            });
            if (effectiveMoves.length > 0) {
                return effectiveMoves[Utils.random(0, effectiveMoves.length - 1)];
            }
        }

        return availableMoves[Utils.random(0, availableMoves.length - 1)];
    },

    _handleEnemyFaint() {
        // Award EXP
        const expGain = Utils.expGain(this.enemyPokemon.baseExp, this.enemyPokemon.level, this.isTrainerBattle);
        this._queueText(`${this.playerPokemon.name} gained ${expGain} EXP. Points!`);

        this.playerPokemon.currentExp += expGain;

        // Check level ups
        while (this.playerPokemon.currentExp >= this.playerPokemon.expToNext && this.playerPokemon.level < 100) {
            const result = PokemonFactory.levelUp(this.playerPokemon);
            this.pendingLevelUps.push(result);
            this._queueText(`${this.playerPokemon.name} grew to LV. ${this.playerPokemon.level}!`);
            Audio.playSfx('level_up');

            if (result.newMoves.length > 0) {
                result.newMoves.forEach(moveId => {
                    this.pendingNewMoves.push(moveId);
                });
            }
            if (result.canEvolve) {
                this.pendingEvolutions.push(this.playerPokemon);
            }
        }

        // Check if trainer has more pokemon
        if (this.isTrainerBattle) {
            this.enemyPartyIndex++;
            if (this.enemyPartyIndex < this.enemyParty.length) {
                this.enemyPokemon = this.enemyParty[this.enemyPartyIndex];
                PokemonFactory.resetStatStages(this.enemyPokemon);
                this._queueText(`${this.trainerData.class} ${this.trainerData.name} sent out ${this.enemyPokemon.name}!`);
                this.state = BATTLE_STATE.TEXT;
                this._showNextText();
                return;
            }
        }

        this.state = BATTLE_STATE.TEXT;
        this._showNextText();
    },

    _handlePlayerFaint() {
        this.playerPokemon.currentHp = 0;
        PokemonFactory.resetStatStages(this.playerPokemon);

        // Check for more alive pokemon
        const nextAlive = Player.party.findIndex((p, i) => i !== this.playerPartyIndex && p.currentHp > 0);
        if (nextAlive >= 0) {
            this._queueText('Use next Pokemon?');
            this.state = BATTLE_STATE.SWITCH_SELECT;
        } else {
            this.state = BATTLE_STATE.DEFEAT;
            this._queueText('You have no more Pokemon that can fight!');
            this._queueText('You blacked out!');
        }

        this.state = BATTLE_STATE.TEXT;
        this._showNextText();
    },

    _updateFaint() {
        // Transition handled in _afterText
    },

    _updateExp() {
        // EXP bar animation handled by UI
        this.state = BATTLE_STATE.ACTION_SELECT;
    },

    _updateLevelUp() {
        if (Input.confirm) {
            if (this.pendingNewMoves.length > 0) {
                const moveId = this.pendingNewMoves.shift();
                const move = MovesDB[moveId];
                if (this.playerPokemon.moves.length < 4) {
                    this.playerPokemon.moves.push(PokemonFactory.createMove(moveId));
                    this._queueText(`${this.playerPokemon.name} learned ${move.name}!`);
                    this.state = BATTLE_STATE.TEXT;
                    this._showNextText();
                } else {
                    // Need to forget a move
                    this._queueText(`${this.playerPokemon.name} wants to learn ${move.name}. But it already knows 4 moves.`);
                    this._queueText(`Delete a move to make room for ${move.name}?`);
                    this.state = BATTLE_STATE.TEXT;
                    this._showNextText();
                    // Simplified: auto-skip learning
                    this._queueText(`${this.playerPokemon.name} did not learn ${move.name}.`);
                }
            } else {
                this.state = BATTLE_STATE.ACTION_SELECT;
            }
        }
    },

    _updateLearnMove() {
        if (this.pendingNewMoves.length > 0) {
            const moveId = this.pendingNewMoves.shift();
            const move = MovesDB[moveId];
            if (this.playerPokemon.moves.length < 4) {
                this.playerPokemon.moves.push(PokemonFactory.createMove(moveId));
                this._queueText(`${this.playerPokemon.name} learned ${move.name}!`);
            } else {
                this._queueText(`${this.playerPokemon.name} did not learn ${move.name}.`);
            }
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
        } else {
            this._afterText();
        }
    },

    _handleEvolution() {
        if (this.pendingEvolutions.length > 0) {
            const pokemon = this.pendingEvolutions.shift();
            const oldName = pokemon.name;
            if (PokemonFactory.evolve(pokemon)) {
                this._queueText(`Congratulations! ${oldName} evolved into ${pokemon.name}!`);
                Audio.playSfx('evolution');
                Player.pokedex.caught.add(pokemon.speciesId);
                Player.pokedex.seen.add(pokemon.speciesId);
            }
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
        }
    },

    _updateVictory() {
        if (Input.confirm) {
            this._endBattle(true);
        }
    },

    _updateDefeat() {
        if (Input.confirm) {
            this._endBattle(false);
        }
    },

    _tryRun() {
        if (this.isTrainerBattle) {
            this._queueText("Can't escape from a trainer battle!");
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
            return;
        }

        const playerSpeed = PokemonFactory.getEffectiveStat(this.playerPokemon, 'speed');
        const enemySpeed = PokemonFactory.getEffectiveStat(this.enemyPokemon, 'speed');
        const escapeChance = ((playerSpeed * 128) / enemySpeed + 30) % 256;

        if (Utils.random(0, 255) < escapeChance) {
            Audio.playSfx('run');
            this._queueText('Got away safely!');
            this.textQueue = [];
            this._queueText('Got away safely!');
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
            this.state = BATTLE_STATE.RUN;
        } else {
            this._queueText("Can't escape!");
            // Enemy attacks
            const enemyMove = this._selectEnemyMove();
            this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, false, false, false);
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
        }
    },

    _updateRun() {
        if (Input.confirm) {
            this._endBattle(false, true);
        }
    },

    _updateCatch() {
        if (this.catchAnim) {
            this.catchAnim.timer++;
            if (this.catchAnim.timer > this.catchAnim.duration) {
                if (this.catchAnim.success) {
                    this._queueText(`Gotcha! ${this.enemyPokemon.name} was caught!`);
                    Audio.playSfx('catch_success');
                    Player.addPokemon(this.enemyPokemon);
                    this.catchAnim = null;
                    this.state = BATTLE_STATE.TEXT;
                    this._showNextText();
                } else {
                    this._queueText('Oh no! The Pokemon broke free!');
                    this.catchAnim = null;
                    // Enemy turn
                    const enemyMove = this._selectEnemyMove();
                    this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, false, false, false);
                    this.state = BATTLE_STATE.TEXT;
                    this._showNextText();
                }
            }
        }
    },

    // Called from BagUI when using a Pokeball
    usePokeball(ballItem) {
        if (this.isTrainerBattle) {
            this._queueText("You can't catch a trainer's Pokemon!");
            this.state = BATTLE_STATE.TEXT;
            this._showNextText();
            return;
        }

        Audio.playSfx('pokeball_throw');
        const catchRate = Utils.catchRate(this.enemyPokemon, ballItem.catchRate,
            this.enemyPokemon.status === 'sleep' || this.enemyPokemon.status === 'freeze' ? 2 :
            this.enemyPokemon.status ? 1.5 : 1);

        const shakes = [0, 0, 0];
        let caught = true;
        for (let i = 0; i < 3; i++) {
            if (Utils.random(0, 255) > catchRate) {
                caught = false;
                shakes[i] = 0;
                break;
            }
            shakes[i] = 1;
        }

        this._queueText(`You threw a ${ballItem.name}!`);
        this.catchAnim = {
            timer: 0,
            duration: 90,
            shakes: shakes,
            success: caught
        };
        this.state = BATTLE_STATE.CATCH;
    },

    // Called from BagUI when using an item on pokemon
    useItem(item) {
        if (item.healAmount) {
            const healAmount = Math.min(item.healAmount, this.playerPokemon.maxHp - this.playerPokemon.currentHp);
            this.playerPokemon.currentHp += healAmount;
            this._queueText(`${this.playerPokemon.name} recovered ${healAmount} HP!`);
            Audio.playSfx('heal');
        }
        if (item.cureStatus) {
            if (item.cureStatus === true || item.cureStatus === this.playerPokemon.status) {
                this.playerPokemon.status = null;
                this._queueText(`${this.playerPokemon.name}'s status was healed!`);
            }
        }

        // Enemy attacks
        const enemyMove = this._selectEnemyMove();
        this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, false, false, false);
        this._endOfTurnEffects();
        this.state = BATTLE_STATE.TEXT;
        this._showNextText();
    },

    // Called from PartyUI when switching pokemon
    switchPokemon(index) {
        PokemonFactory.resetStatStages(this.playerPokemon);
        this.playerPartyIndex = index;
        this.playerPokemon = Player.party[index];
        PokemonFactory.resetStatStages(this.playerPokemon);

        this._queueText(`Go! ${this.playerPokemon.name}!`);

        // If in battle, enemy gets a free turn
        if (this.enemyPokemon.currentHp > 0) {
            const enemyMove = this._selectEnemyMove();
            this._executeMove(this.enemyPokemon, this.playerPokemon, enemyMove, false, false, false, false);
            this._endOfTurnEffects();
        }

        this.state = BATTLE_STATE.TEXT;
        this._showNextText();
    },

    _endBattle(won, ran = false) {
        this.active = false;

        if (won && this.isTrainerBattle && this.trainerData) {
            Player.money += this.trainerData.reward;
            if (this.trainerData.badge) {
                Player.badges.push(this.trainerData.badge);
            }
        }

        // Reset stat stages for player pokemon
        Player.party.forEach(p => PokemonFactory.resetStatStages(p));

        if (!won && !ran) {
            // Blackout - heal and teleport to last Pokemon Center
            Player.healParty();
            Player.money = Math.floor(Player.money / 2);
        }

        Audio.stopMusic();
        if (this.onEnd) this.onEnd(won, ran);
    },

    _queueText(text) {
        this.textQueue.push(text);
    },

    _showNextText() {
        if (this.textQueue.length > 0) {
            this.currentText = this.textQueue.shift();
            this.textCharIndex = 0;
            this.textTimer = 0;
        }
    },

    draw(ctx) {
        // Drawn by BattleUI
    }
};

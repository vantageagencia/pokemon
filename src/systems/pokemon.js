// Pokemon instance creation and management
const PokemonFactory = {
    create(speciesId, level, isWild = true) {
        const species = PokemonDB[speciesId];
        if (!species) {
            console.error('Unknown pokemon:', speciesId);
            return null;
        }

        // Generate IVs (0-31)
        const ivs = {
            hp: Utils.random(0, 31),
            attack: Utils.random(0, 31),
            defense: Utils.random(0, 31),
            spAttack: Utils.random(0, 31),
            spDefense: Utils.random(0, 31),
            speed: Utils.random(0, 31)
        };

        const evs = { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };

        const pokemon = {
            speciesId: speciesId,
            name: species.name,
            nickname: null,
            level: level,
            types: [...species.types],
            ivs: ivs,
            evs: evs,
            currentExp: Utils.expForLevel(level),
            expToNext: Utils.expForLevel(level + 1),
            status: null, // poison, paralyze, burn, freeze, sleep
            statusTurns: 0,
            isWild: isWild,
            catchRate: species.catchRate,
            baseExp: species.baseExp,

            // Stats calculated
            maxHp: 0,
            currentHp: 0,
            attack: 0,
            defense: 0,
            spAttack: 0,
            spDefense: 0,
            speed: 0,

            // Battle stat stages
            statStages: { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 },

            // Moves (max 4)
            moves: [],

            // For evolution tracking
            species: species
        };

        // Calculate stats
        this.recalcStats(pokemon);
        pokemon.currentHp = pokemon.maxHp;

        // Learn moves for level
        this._learnMovesForLevel(pokemon, species, level);

        return pokemon;
    },

    recalcStats(pokemon) {
        const species = PokemonDB[pokemon.speciesId];
        const level = pokemon.level;
        const ivs = pokemon.ivs;
        const evs = pokemon.evs;

        pokemon.maxHp = Utils.calcHP(species.baseStats.hp, ivs.hp, evs.hp, level);
        pokemon.attack = Utils.calcStat(species.baseStats.attack, ivs.attack, evs.attack, level);
        pokemon.defense = Utils.calcStat(species.baseStats.defense, ivs.defense, evs.defense, level);
        pokemon.spAttack = Utils.calcStat(species.baseStats.spAttack, ivs.spAttack, evs.spAttack, level);
        pokemon.spDefense = Utils.calcStat(species.baseStats.spDefense, ivs.spDefense, evs.spDefense, level);
        pokemon.speed = Utils.calcStat(species.baseStats.speed, ivs.speed, evs.speed, level);
    },

    _learnMovesForLevel(pokemon, species, level) {
        const moves = [];
        const learnset = species.learnset;

        // Collect all moves learnable up to this level
        for (let l = 1; l <= level; l++) {
            if (learnset[l]) {
                for (const moveId of learnset[l]) {
                    if (MovesDB[moveId]) {
                        moves.push(moveId);
                    }
                }
            }
        }

        // Take the last 4 moves (most recent)
        const finalMoves = moves.slice(-4);
        pokemon.moves = finalMoves.map(moveId => {
            const move = MovesDB[moveId];
            return {
                id: moveId,
                name: move.name,
                type: move.type,
                category: move.category,
                power: move.power,
                accuracy: move.accuracy,
                maxPp: move.pp,
                currentPp: move.pp,
                priority: move.priority || 0,
                highCrit: move.highCrit || false,
                effect: move.effect
            };
        });
    },

    // Level up a pokemon
    levelUp(pokemon) {
        pokemon.level++;
        const oldMaxHp = pokemon.maxHp;
        this.recalcStats(pokemon);
        const hpGain = pokemon.maxHp - oldMaxHp;
        pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + hpGain);
        pokemon.expToNext = Utils.expForLevel(pokemon.level + 1);

        // Check for new moves
        const species = PokemonDB[pokemon.speciesId];
        const newMoves = [];
        if (species.learnset[pokemon.level]) {
            for (const moveId of species.learnset[pokemon.level]) {
                if (MovesDB[moveId] && !pokemon.moves.find(m => m.id === moveId)) {
                    newMoves.push(moveId);
                }
            }
        }

        return {
            hpGain,
            newMoves,
            canEvolve: this.canEvolve(pokemon)
        };
    },

    canEvolve(pokemon) {
        const species = PokemonDB[pokemon.speciesId];
        if (!species.evolution) return false;
        return pokemon.level >= species.evolution.level;
    },

    evolve(pokemon) {
        const species = PokemonDB[pokemon.speciesId];
        if (!species.evolution) return false;

        const newSpeciesId = species.evolution.into;
        const newSpecies = PokemonDB[newSpeciesId];
        if (!newSpecies) return false;

        const oldName = pokemon.name;
        pokemon.speciesId = newSpeciesId;
        pokemon.name = newSpecies.name;
        pokemon.types = [...newSpecies.types];
        pokemon.species = newSpecies;
        pokemon.catchRate = newSpecies.catchRate;
        pokemon.baseExp = newSpecies.baseExp;

        if (!pokemon.nickname || pokemon.nickname === oldName) {
            pokemon.nickname = null;
        }

        this.recalcStats(pokemon);

        return true;
    },

    // Get the stat multiplier from stat stages
    getStatMultiplier(stage) {
        const multipliers = {
            '-6': 2/8, '-5': 2/7, '-4': 2/6, '-3': 2/5, '-2': 2/4, '-1': 2/3,
            '0': 1,
            '1': 3/2, '2': 4/2, '3': 5/2, '4': 6/2, '5': 7/2, '6': 8/2
        };
        return multipliers[String(stage)] || 1;
    },

    // Get effective stat in battle
    getEffectiveStat(pokemon, stat) {
        const base = pokemon[stat];
        const stage = pokemon.statStages[stat] || 0;
        return Math.floor(base * this.getStatMultiplier(stage));
    },

    // Create a move object for learning
    createMove(moveId) {
        const move = MovesDB[moveId];
        if (!move) return null;
        return {
            id: moveId,
            name: move.name,
            type: move.type,
            category: move.category,
            power: move.power,
            accuracy: move.accuracy,
            maxPp: move.pp,
            currentPp: move.pp,
            priority: move.priority || 0,
            highCrit: move.highCrit || false,
            effect: move.effect
        };
    },

    resetStatStages(pokemon) {
        pokemon.statStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
    }
};

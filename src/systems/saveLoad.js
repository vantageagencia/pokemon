// Save/Load system using localStorage
const SaveSystem = {
    SAVE_KEY: 'pokemon_clone_save',

    save() {
        const data = {
            player: {
                name: Player.name,
                x: Player.x,
                y: Player.y,
                direction: Player.direction,
                currentMap: Player.currentMap,
                money: Player.money,
                badges: [...Player.badges],
                hasStarter: Player.hasStarter,
                rivalStarter: Player.rivalStarter,
                repelSteps: Player.repelSteps
            },
            party: Player.party.map(p => this._serializePokemon(p)),
            pc: Player.pc.map(p => this._serializePokemon(p)),
            pokedex: {
                seen: [...Player.pokedex.seen],
                caught: [...Player.pokedex.caught]
            },
            inventory: Inventory.toJSON(),
            trainers: {},
            timestamp: Date.now()
        };

        // Save trainer defeated states
        Object.keys(TrainerDB).forEach(key => {
            data.trainers[key] = { defeated: TrainerDB[key].defeated };
        });

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    },

    load() {
        try {
            const json = localStorage.getItem(this.SAVE_KEY);
            if (!json) return false;

            const data = JSON.parse(json);

            // Restore player
            Player.name = data.player.name;
            Player.money = data.player.money;
            Player.badges = data.player.badges || [];
            Player.hasStarter = data.player.hasStarter;
            Player.rivalStarter = data.player.rivalStarter;
            Player.repelSteps = data.player.repelSteps || 0;
            Player.currentMap = data.player.currentMap;
            Player.init(data.player.currentMap, data.player.x, data.player.y);
            Player.direction = data.player.direction;

            // Restore party
            Player.party = data.party.map(p => this._deserializePokemon(p));
            Player.pc = data.pc.map(p => this._deserializePokemon(p));

            // Restore pokedex
            Player.pokedex.seen = new Set(data.pokedex.seen);
            Player.pokedex.caught = new Set(data.pokedex.caught);

            // Restore inventory
            Inventory.fromJSON(data.inventory);

            // Restore trainer states
            if (data.trainers) {
                Object.keys(data.trainers).forEach(key => {
                    if (TrainerDB[key]) {
                        TrainerDB[key].defeated = data.trainers[key].defeated;
                    }
                });
            }

            return true;
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        }
    },

    hasSave() {
        return !!localStorage.getItem(this.SAVE_KEY);
    },

    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    },

    _serializePokemon(p) {
        return {
            speciesId: p.speciesId,
            nickname: p.nickname,
            level: p.level,
            currentExp: p.currentExp,
            ivs: { ...p.ivs },
            evs: { ...p.evs },
            currentHp: p.currentHp,
            status: p.status,
            moves: p.moves.map(m => ({
                id: m.id,
                currentPp: m.currentPp
            }))
        };
    },

    _deserializePokemon(data) {
        const pokemon = PokemonFactory.create(data.speciesId, data.level, false);
        if (!pokemon) return null;

        pokemon.nickname = data.nickname;
        pokemon.currentExp = data.currentExp;
        pokemon.ivs = data.ivs;
        pokemon.evs = data.evs;
        PokemonFactory.recalcStats(pokemon);
        pokemon.currentHp = Math.min(data.currentHp, pokemon.maxHp);
        pokemon.status = data.status;

        // Restore move PP
        if (data.moves) {
            data.moves.forEach((savedMove, i) => {
                const move = pokemon.moves.find(m => m.id === savedMove.id);
                if (move) {
                    move.currentPp = savedMove.currentPp;
                }
            });
        }

        return pokemon;
    }
};

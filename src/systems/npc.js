// NPC system
const NPCSystem = {
    draw(ctx, npcs) {
        if (!npcs) return;
        npcs.forEach(npc => {
            const sprite = CharacterSprites.getSprite(npc.sprite, CharacterSprites.getDirFromEnum(npc.dir), 0);
            const screenPos = Camera.worldToScreen(npc.x * SCALED_TILE, npc.y * SCALED_TILE);
            SpriteRenderer.draw(ctx, sprite, screenPos.x, screenPos.y, SCALE);
        });
    },

    interact(npc, game) {
        if (npc.event) {
            this._handleEvent(npc, game);
            return;
        }

        if (npc.trainer && npc.trainerId) {
            const trainer = TrainerDB[npc.trainerId];
            if (trainer && !trainer.defeated) {
                // Trainer battle
                TextBox.show(trainer.beforeText, () => {
                    game.startTrainerBattle(trainer, npc.trainerId);
                });
            } else if (trainer && trainer.defeated) {
                TextBox.show(trainer.afterText);
            }
            return;
        }

        if (npc.dialog) {
            TextBox.show(npc.dialog);
        }
    },

    _handleEvent(npc, game) {
        switch (npc.event) {
            case 'starter_select':
                this._starterSelect(game);
                break;
            case 'heal_pokemon':
                this._healPokemon(game);
                break;
            case 'shop':
                this._openShop(npc, game);
                break;
        }
    },

    _starterSelect(game) {
        if (Player.hasStarter) {
            TextBox.show("Your Pokemon journey has already begun! Go explore the world!");
            return;
        }

        TextBox.show("Welcome to the world of Pokemon! I'm Prof. Oak. Please choose your partner Pokemon!", () => {
            TextBox.showChoice("Which Pokemon will you choose?",
                ['Bulbasaur', 'Charmander', 'Squirtle'],
                (choice) => {
                    const starters = ['bulbasaur', 'charmander', 'squirtle'];
                    const rivalStarters = ['charmander', 'squirtle', 'bulbasaur']; // Rival picks advantage
                    const starterNames = ['Bulbasaur', 'Charmander', 'Squirtle'];

                    const chosen = starters[choice];
                    const pokemon = PokemonFactory.create(chosen, 5, false);
                    Player.addPokemon(pokemon);
                    Player.hasStarter = true;
                    Player.rivalStarter = rivalStarters[choice];

                    // Set up rival's team
                    TrainerDB.rival.pokemon = [{ species: rivalStarters[choice], level: 5 }];

                    TextBox.show(`You received ${starterNames[choice]}! Take good care of it!`, () => {
                        TextBox.show(`Your rival Blue chose ${starterNames[starters.indexOf(rivalStarters[choice])]}!`, () => {
                            TextBox.show("Now go explore the world and fill your Pokedex!");
                        });
                    });
                }
            );
        });
    },

    _healPokemon(game) {
        if (Player.party.length === 0) {
            TextBox.show("You don't have any Pokemon yet!");
            return;
        }

        TextBox.show("Welcome to the Pokemon Center! Let me heal your Pokemon.", () => {
            Player.healParty();
            Audio.playSfx('heal');
            TextBox.show("Your Pokemon are fully healed! We hope to see you again!");
        });
    },

    _openShop(npc, game) {
        TextBox.show("Welcome! What can I do for you?", () => {
            game.openShop(npc.shopItems);
        });
    }
};

// Wild encounter system
const WildEncounter = {
    generate(mapData) {
        if (!mapData.wildPokemon || !mapData.wildPokemon.grass) return null;

        const pool = mapData.wildPokemon.grass;
        const selected = Utils.weightedRandom(pool);

        const level = Utils.random(selected.minLevel, selected.maxLevel);
        return PokemonFactory.create(selected.species, level, true);
    }
};

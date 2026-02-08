// Pokemon database - Generation 1 starters and common Pokemon
const PokemonDB = {
    // Starters
    bulbasaur: {
        id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'],
        baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 },
        baseExp: 64, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'growl'],
            7: ['leech_seed'],
            13: ['vine_whip'],
            20: ['poison_powder'],
            27: ['razor_leaf'],
            34: ['sleep_powder'],
            41: ['solar_beam']
        },
        evolution: { level: 16, into: 'ivysaur' }
    },
    ivysaur: {
        id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'],
        baseStats: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 },
        baseExp: 142, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'growl', 'leech_seed', 'vine_whip'],
            22: ['poison_powder'],
            30: ['razor_leaf'],
            38: ['sleep_powder'],
            46: ['solar_beam']
        },
        evolution: { level: 32, into: 'venusaur' }
    },
    venusaur: {
        id: 3, name: 'Venusaur', types: ['Grass', 'Poison'],
        baseStats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 },
        baseExp: 236, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'growl', 'leech_seed', 'vine_whip'],
            22: ['poison_powder'],
            30: ['razor_leaf'],
            40: ['sleep_powder'],
            50: ['solar_beam']
        },
        evolution: null
    },
    charmander: {
        id: 4, name: 'Charmander', types: ['Fire'],
        baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
        baseExp: 62, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['scratch', 'growl'],
            9: ['ember'],
            15: ['leer'],
            22: ['dragon_rage'],
            30: ['slash'],
            38: ['flamethrower'],
            46: ['fire_spin']
        },
        evolution: { level: 16, into: 'charmeleon' }
    },
    charmeleon: {
        id: 5, name: 'Charmeleon', types: ['Fire'],
        baseStats: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 },
        baseExp: 142, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['scratch', 'growl', 'ember'],
            15: ['leer'],
            24: ['dragon_rage'],
            33: ['slash'],
            42: ['flamethrower'],
            56: ['fire_spin']
        },
        evolution: { level: 36, into: 'charizard' }
    },
    charizard: {
        id: 6, name: 'Charizard', types: ['Fire', 'Flying'],
        baseStats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 },
        baseExp: 240, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['scratch', 'growl', 'ember', 'leer'],
            24: ['dragon_rage'],
            36: ['wing_attack'],
            42: ['flamethrower'],
            54: ['fire_blast']
        },
        evolution: null
    },
    squirtle: {
        id: 7, name: 'Squirtle', types: ['Water'],
        baseStats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 },
        baseExp: 63, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'tail_whip'],
            8: ['bubble'],
            15: ['water_gun'],
            22: ['bite'],
            28: ['withdraw'],
            35: ['bubble_beam'],
            42: ['hydro_pump']
        },
        evolution: { level: 16, into: 'wartortle' }
    },
    wartortle: {
        id: 8, name: 'Wartortle', types: ['Water'],
        baseStats: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 },
        baseExp: 142, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'tail_whip', 'bubble', 'water_gun'],
            25: ['bite'],
            31: ['withdraw'],
            39: ['bubble_beam'],
            47: ['hydro_pump']
        },
        evolution: { level: 36, into: 'blastoise' }
    },
    blastoise: {
        id: 9, name: 'Blastoise', types: ['Water'],
        baseStats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 },
        baseExp: 239, catchRate: 45, genderRatio: 87.5,
        learnset: {
            1: ['tackle', 'tail_whip', 'water_gun', 'bite'],
            31: ['withdraw'],
            42: ['surf'],
            55: ['hydro_pump']
        },
        evolution: null
    },

    // Common Pokemon
    pidgey: {
        id: 16, name: 'Pidgey', types: ['Normal', 'Flying'],
        baseStats: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 },
        baseExp: 50, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle', 'sand_attack'], 9: ['gust'], 15: ['quick_attack'], 21: ['wing_attack'] },
        evolution: { level: 18, into: 'pidgeotto' }
    },
    pidgeotto: {
        id: 17, name: 'Pidgeotto', types: ['Normal', 'Flying'],
        baseStats: { hp: 63, attack: 60, defense: 55, spAttack: 50, spDefense: 50, speed: 71 },
        baseExp: 122, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['tackle', 'sand_attack', 'gust'], 20: ['quick_attack'], 27: ['wing_attack'] },
        evolution: { level: 36, into: 'pidgeot' }
    },
    pidgeot: {
        id: 18, name: 'Pidgeot', types: ['Normal', 'Flying'],
        baseStats: { hp: 83, attack: 80, defense: 75, spAttack: 70, spDefense: 70, speed: 101 },
        baseExp: 216, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['tackle', 'gust', 'quick_attack', 'wing_attack'] },
        evolution: null
    },
    rattata: {
        id: 19, name: 'Rattata', types: ['Normal'],
        baseStats: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 },
        baseExp: 51, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle', 'tail_whip'], 7: ['quick_attack'], 14: ['bite'], 23: ['body_slam'] },
        evolution: { level: 20, into: 'raticate' }
    },
    raticate: {
        id: 20, name: 'Raticate', types: ['Normal'],
        baseStats: { hp: 55, attack: 81, defense: 60, spAttack: 50, spDefense: 70, speed: 97 },
        baseExp: 145, catchRate: 127, genderRatio: 50,
        learnset: { 1: ['tackle', 'tail_whip', 'quick_attack', 'bite'] },
        evolution: null
    },
    caterpie: {
        id: 10, name: 'Caterpie', types: ['Bug'],
        baseStats: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 },
        baseExp: 39, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle', 'string_shot'] },
        evolution: { level: 7, into: 'metapod' }
    },
    metapod: {
        id: 11, name: 'Metapod', types: ['Bug'],
        baseStats: { hp: 50, attack: 20, defense: 55, spAttack: 25, spDefense: 25, speed: 30 },
        baseExp: 72, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['tackle', 'harden'] },
        evolution: { level: 10, into: 'butterfree' }
    },
    butterfree: {
        id: 12, name: 'Butterfree', types: ['Bug', 'Flying'],
        baseStats: { hp: 60, attack: 45, defense: 50, spAttack: 90, spDefense: 80, speed: 70 },
        baseExp: 178, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['confusion', 'gust'], 13: ['sleep_powder'], 15: ['stun_spore'], 18: ['poison_powder'], 28: ['psychic'] },
        evolution: null
    },
    weedle: {
        id: 13, name: 'Weedle', types: ['Bug', 'Poison'],
        baseStats: { hp: 40, attack: 35, defense: 30, spAttack: 20, spDefense: 20, speed: 50 },
        baseExp: 39, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['poison_sting', 'string_shot'] },
        evolution: { level: 7, into: 'kakuna' }
    },
    kakuna: {
        id: 14, name: 'Kakuna', types: ['Bug', 'Poison'],
        baseStats: { hp: 45, attack: 25, defense: 50, spAttack: 25, spDefense: 25, speed: 35 },
        baseExp: 72, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['poison_sting', 'harden'] },
        evolution: { level: 10, into: 'beedrill' }
    },
    beedrill: {
        id: 15, name: 'Beedrill', types: ['Bug', 'Poison'],
        baseStats: { hp: 65, attack: 90, defense: 40, spAttack: 45, spDefense: 80, speed: 75 },
        baseExp: 178, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['poison_sting', 'bug_bite'], 20: ['sludge_bomb'] },
        evolution: null
    },
    pikachu: {
        id: 25, name: 'Pikachu', types: ['Electric'],
        baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
        baseExp: 112, catchRate: 190, genderRatio: 50,
        learnset: { 1: ['thunder_shock', 'growl'], 9: ['thunder_wave'], 16: ['quick_attack'], 26: ['thunderbolt'], 33: ['agility'], 43: ['thunder'] },
        evolution: null // needs Thunder Stone in original, simplified here
    },
    nidoran_m: {
        id: 32, name: 'Nidoran M', types: ['Poison'],
        baseStats: { hp: 46, attack: 57, defense: 40, spAttack: 40, spDefense: 40, speed: 50 },
        baseExp: 55, catchRate: 235, genderRatio: 100,
        learnset: { 1: ['leer', 'peck'], 8: ['poison_sting'], 14: ['bite'], 23: ['horn_attack'] },
        evolution: { level: 16, into: 'nidorino' }
    },
    nidorino: {
        id: 33, name: 'Nidorino', types: ['Poison'],
        baseStats: { hp: 61, attack: 72, defense: 57, spAttack: 55, spDefense: 55, speed: 65 },
        baseExp: 128, catchRate: 120, genderRatio: 100,
        learnset: { 1: ['leer', 'peck', 'poison_sting'], 20: ['bite'] },
        evolution: null
    },
    zubat: {
        id: 41, name: 'Zubat', types: ['Poison', 'Flying'],
        baseStats: { hp: 40, attack: 45, defense: 35, spAttack: 30, spDefense: 40, speed: 55 },
        baseExp: 49, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['leer', 'bite'], 10: ['wing_attack'], 18: ['confusion'] },
        evolution: { level: 22, into: 'golbat' }
    },
    golbat: {
        id: 42, name: 'Golbat', types: ['Poison', 'Flying'],
        baseStats: { hp: 75, attack: 80, defense: 70, spAttack: 65, spDefense: 75, speed: 90 },
        baseExp: 171, catchRate: 90, genderRatio: 50,
        learnset: { 1: ['bite', 'wing_attack', 'confusion'] },
        evolution: null
    },
    geodude: {
        id: 74, name: 'Geodude', types: ['Rock', 'Ground'],
        baseStats: { hp: 40, attack: 80, defense: 100, spAttack: 30, spDefense: 30, speed: 20 },
        baseExp: 60, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle'], 6: ['rock_throw'], 16: ['rock_slide'], 26: ['earthquake'] },
        evolution: { level: 25, into: 'graveler' }
    },
    graveler: {
        id: 75, name: 'Graveler', types: ['Rock', 'Ground'],
        baseStats: { hp: 55, attack: 95, defense: 115, spAttack: 45, spDefense: 45, speed: 35 },
        baseExp: 137, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['tackle', 'rock_throw', 'rock_slide'], 30: ['earthquake'] },
        evolution: null
    },
    machop: {
        id: 66, name: 'Machop', types: ['Fighting'],
        baseStats: { hp: 70, attack: 80, defense: 50, spAttack: 35, spDefense: 35, speed: 35 },
        baseExp: 61, catchRate: 180, genderRatio: 75,
        learnset: { 1: ['low_kick', 'leer'], 10: ['karate_chop'], 20: ['body_slam'], 32: ['cross_chop'] },
        evolution: { level: 28, into: 'machoke' }
    },
    machoke: {
        id: 67, name: 'Machoke', types: ['Fighting'],
        baseStats: { hp: 80, attack: 100, defense: 70, spAttack: 50, spDefense: 60, speed: 45 },
        baseExp: 142, catchRate: 90, genderRatio: 75,
        learnset: { 1: ['low_kick', 'leer', 'karate_chop'], 25: ['body_slam'], 36: ['cross_chop'] },
        evolution: null
    },
    gastly: {
        id: 92, name: 'Gastly', types: ['Ghost', 'Poison'],
        baseStats: { hp: 30, attack: 35, defense: 30, spAttack: 100, spDefense: 35, speed: 80 },
        baseExp: 62, catchRate: 190, genderRatio: 50,
        learnset: { 1: ['lick', 'hypnosis'], 8: ['confusion'], 16: ['night_shade'], 28: ['shadow_ball'] },
        evolution: { level: 25, into: 'haunter' }
    },
    haunter: {
        id: 93, name: 'Haunter', types: ['Ghost', 'Poison'],
        baseStats: { hp: 45, attack: 50, defense: 45, spAttack: 115, spDefense: 55, speed: 95 },
        baseExp: 142, catchRate: 90, genderRatio: 50,
        learnset: { 1: ['lick', 'hypnosis', 'confusion', 'night_shade'], 33: ['shadow_ball'] },
        evolution: null
    },
    abra: {
        id: 63, name: 'Abra', types: ['Psychic'],
        baseStats: { hp: 25, attack: 20, defense: 15, spAttack: 105, spDefense: 55, speed: 90 },
        baseExp: 62, catchRate: 200, genderRatio: 75,
        learnset: { 1: ['confusion'] },
        evolution: { level: 16, into: 'kadabra' }
    },
    kadabra: {
        id: 64, name: 'Kadabra', types: ['Psychic'],
        baseStats: { hp: 40, attack: 35, defense: 30, spAttack: 120, spDefense: 70, speed: 105 },
        baseExp: 145, catchRate: 100, genderRatio: 75,
        learnset: { 1: ['confusion'], 16: ['psychic'], 26: ['recover'] },
        evolution: null
    },
    magikarp: {
        id: 129, name: 'Magikarp', types: ['Water'],
        baseStats: { hp: 20, attack: 10, defense: 55, spAttack: 15, spDefense: 20, speed: 80 },
        baseExp: 40, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle'] },
        evolution: { level: 20, into: 'gyarados' }
    },
    gyarados: {
        id: 130, name: 'Gyarados', types: ['Water', 'Flying'],
        baseStats: { hp: 95, attack: 125, defense: 79, spAttack: 60, spDefense: 100, speed: 81 },
        baseExp: 189, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['bite', 'dragon_rage'], 25: ['hydro_pump'], 35: ['hyper_beam'] },
        evolution: null
    },
    eevee: {
        id: 133, name: 'Eevee', types: ['Normal'],
        baseStats: { hp: 55, attack: 55, defense: 50, spAttack: 45, spDefense: 65, speed: 55 },
        baseExp: 65, catchRate: 45, genderRatio: 87.5,
        learnset: { 1: ['tackle', 'tail_whip'], 8: ['sand_attack'], 16: ['quick_attack'], 23: ['bite'], 30: ['body_slam'] },
        evolution: null
    },
    snorlax: {
        id: 143, name: 'Snorlax', types: ['Normal'],
        baseStats: { hp: 160, attack: 110, defense: 65, spAttack: 65, spDefense: 110, speed: 30 },
        baseExp: 189, catchRate: 25, genderRatio: 87.5,
        learnset: { 1: ['tackle', 'headbutt'], 15: ['body_slam'], 25: ['rest'], 35: ['hyper_beam'] },
        evolution: null
    },
    dratini: {
        id: 147, name: 'Dratini', types: ['Dragon'],
        baseStats: { hp: 41, attack: 64, defense: 45, spAttack: 50, spDefense: 50, speed: 50 },
        baseExp: 60, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['dragon_rage', 'tackle'], 15: ['thunder_wave'], 25: ['slam'], 35: ['dragon_claw'] },
        evolution: { level: 30, into: 'dragonair' }
    },
    dragonair: {
        id: 148, name: 'Dragonair', types: ['Dragon'],
        baseStats: { hp: 61, attack: 84, defense: 65, spAttack: 70, spDefense: 70, speed: 70 },
        baseExp: 147, catchRate: 45, genderRatio: 50,
        learnset: { 1: ['dragon_rage', 'tackle', 'thunder_wave'], 33: ['slam'], 38: ['dragon_claw'], 45: ['hyper_beam'] },
        evolution: null
    },
    growlithe: {
        id: 58, name: 'Growlithe', types: ['Fire'],
        baseStats: { hp: 55, attack: 70, defense: 45, spAttack: 70, spDefense: 50, speed: 60 },
        baseExp: 70, catchRate: 190, genderRatio: 75,
        learnset: { 1: ['bite', 'growl'], 9: ['ember'], 18: ['leer'], 26: ['flamethrower'], 34: ['fire_blast'] },
        evolution: null
    },
    oddish: {
        id: 43, name: 'Oddish', types: ['Grass', 'Poison'],
        baseStats: { hp: 45, attack: 50, defense: 55, spAttack: 75, spDefense: 65, speed: 30 },
        baseExp: 64, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['tackle', 'poison_powder'], 10: ['stun_spore'], 15: ['acid'], 20: ['sleep_powder'], 28: ['razor_leaf'] },
        evolution: { level: 21, into: 'gloom' }
    },
    gloom: {
        id: 44, name: 'Gloom', types: ['Grass', 'Poison'],
        baseStats: { hp: 60, attack: 65, defense: 70, spAttack: 85, spDefense: 75, speed: 40 },
        baseExp: 138, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['tackle', 'poison_powder', 'acid'], 24: ['sleep_powder'], 33: ['razor_leaf'], 44: ['solar_beam'] },
        evolution: null
    },
    poliwag: {
        id: 60, name: 'Poliwag', types: ['Water'],
        baseStats: { hp: 40, attack: 50, defense: 40, spAttack: 40, spDefense: 40, speed: 90 },
        baseExp: 60, catchRate: 255, genderRatio: 50,
        learnset: { 1: ['water_gun', 'tackle'], 12: ['bubble_beam'], 19: ['body_slam'], 26: ['surf'] },
        evolution: { level: 25, into: 'poliwhirl' }
    },
    poliwhirl: {
        id: 61, name: 'Poliwhirl', types: ['Water'],
        baseStats: { hp: 65, attack: 65, defense: 65, spAttack: 50, spDefense: 50, speed: 90 },
        baseExp: 135, catchRate: 120, genderRatio: 50,
        learnset: { 1: ['water_gun', 'bubble_beam'], 27: ['body_slam'], 33: ['surf'], 41: ['hydro_pump'] },
        evolution: null
    }
};

// Add slash move that was referenced
MovesDB.slash = { name: 'Slash', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 70, accuracy: 100, pp: 20, highCrit: true, effect: null };
MovesDB.horn_attack = { name: 'Horn Attack', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 65, accuracy: 100, pp: 25, effect: null };

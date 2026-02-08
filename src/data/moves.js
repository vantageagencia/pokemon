// Move database
const MOVE_CATEGORY = { PHYSICAL: 'Physical', SPECIAL: 'Special', STATUS: 'Status' };

const MovesDB = {
    // Normal moves
    tackle: { name: 'Tackle', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 40, accuracy: 100, pp: 35, effect: null },
    scratch: { name: 'Scratch', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 40, accuracy: 100, pp: 35, effect: null },
    pound: { name: 'Pound', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 40, accuracy: 100, pp: 35, effect: null },
    quick_attack: { name: 'Quick Attack', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 40, accuracy: 100, pp: 30, priority: 1, effect: null },
    body_slam: { name: 'Body Slam', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 85, accuracy: 100, pp: 15, effect: { type: 'paralyze', chance: 30 } },
    hyper_beam: { name: 'Hyper Beam', type: 'Normal', category: MOVE_CATEGORY.SPECIAL, power: 150, accuracy: 90, pp: 5, effect: { type: 'recharge' } },
    slam: { name: 'Slam', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 80, accuracy: 75, pp: 20, effect: null },
    headbutt: { name: 'Headbutt', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 70, accuracy: 100, pp: 15, effect: { type: 'flinch', chance: 30 } },
    bite: { name: 'Bite', type: 'Normal', category: MOVE_CATEGORY.PHYSICAL, power: 60, accuracy: 100, pp: 25, effect: { type: 'flinch', chance: 30 } },

    // Fire moves
    ember: { name: 'Ember', type: 'Fire', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 25, effect: { type: 'burn', chance: 10 } },
    flamethrower: { name: 'Flamethrower', type: 'Fire', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 15, effect: { type: 'burn', chance: 10 } },
    fire_blast: { name: 'Fire Blast', type: 'Fire', category: MOVE_CATEGORY.SPECIAL, power: 110, accuracy: 85, pp: 5, effect: { type: 'burn', chance: 10 } },
    fire_spin: { name: 'Fire Spin', type: 'Fire', category: MOVE_CATEGORY.SPECIAL, power: 35, accuracy: 85, pp: 15, effect: { type: 'trap' } },
    fire_punch: { name: 'Fire Punch', type: 'Fire', category: MOVE_CATEGORY.PHYSICAL, power: 75, accuracy: 100, pp: 15, effect: { type: 'burn', chance: 10 } },

    // Water moves
    water_gun: { name: 'Water Gun', type: 'Water', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 25, effect: null },
    bubble: { name: 'Bubble', type: 'Water', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 30, effect: { type: 'speed_down', chance: 10 } },
    surf: { name: 'Surf', type: 'Water', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 15, effect: null },
    hydro_pump: { name: 'Hydro Pump', type: 'Water', category: MOVE_CATEGORY.SPECIAL, power: 110, accuracy: 80, pp: 5, effect: null },
    bubble_beam: { name: 'Bubble Beam', type: 'Water', category: MOVE_CATEGORY.SPECIAL, power: 65, accuracy: 100, pp: 20, effect: { type: 'speed_down', chance: 10 } },
    withdraw: { name: 'Withdraw', type: 'Water', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 40, effect: { type: 'stat_up', stat: 'defense', stages: 1, target: 'self' } },

    // Grass moves
    vine_whip: { name: 'Vine Whip', type: 'Grass', category: MOVE_CATEGORY.PHYSICAL, power: 45, accuracy: 100, pp: 25, effect: null },
    razor_leaf: { name: 'Razor Leaf', type: 'Grass', category: MOVE_CATEGORY.PHYSICAL, power: 55, accuracy: 95, pp: 25, highCrit: true, effect: null },
    solar_beam: { name: 'Solar Beam', type: 'Grass', category: MOVE_CATEGORY.SPECIAL, power: 120, accuracy: 100, pp: 10, effect: { type: 'charge' } },
    leech_seed: { name: 'Leech Seed', type: 'Grass', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 90, pp: 10, effect: { type: 'leech_seed' } },
    sleep_powder: { name: 'Sleep Powder', type: 'Grass', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 75, pp: 15, effect: { type: 'sleep' } },
    poison_powder: { name: 'Poison Powder', type: 'Poison', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 75, pp: 35, effect: { type: 'poison' } },
    stun_spore: { name: 'Stun Spore', type: 'Grass', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 75, pp: 30, effect: { type: 'paralyze' } },

    // Electric moves
    thunder_shock: { name: 'Thunder Shock', type: 'Electric', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 30, effect: { type: 'paralyze', chance: 10 } },
    thunderbolt: { name: 'Thunderbolt', type: 'Electric', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 15, effect: { type: 'paralyze', chance: 10 } },
    thunder: { name: 'Thunder', type: 'Electric', category: MOVE_CATEGORY.SPECIAL, power: 110, accuracy: 70, pp: 10, effect: { type: 'paralyze', chance: 30 } },
    thunder_wave: { name: 'Thunder Wave', type: 'Electric', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 20, effect: { type: 'paralyze' } },

    // Ice moves
    ice_beam: { name: 'Ice Beam', type: 'Ice', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 10, effect: { type: 'freeze', chance: 10 } },
    blizzard: { name: 'Blizzard', type: 'Ice', category: MOVE_CATEGORY.SPECIAL, power: 110, accuracy: 70, pp: 5, effect: { type: 'freeze', chance: 10 } },

    // Fighting moves
    low_kick: { name: 'Low Kick', type: 'Fighting', category: MOVE_CATEGORY.PHYSICAL, power: 50, accuracy: 100, pp: 20, effect: null },
    karate_chop: { name: 'Karate Chop', type: 'Fighting', category: MOVE_CATEGORY.PHYSICAL, power: 50, accuracy: 100, pp: 25, highCrit: true, effect: null },
    cross_chop: { name: 'Cross Chop', type: 'Fighting', category: MOVE_CATEGORY.PHYSICAL, power: 100, accuracy: 80, pp: 5, highCrit: true, effect: null },

    // Poison moves
    poison_sting: { name: 'Poison Sting', type: 'Poison', category: MOVE_CATEGORY.PHYSICAL, power: 15, accuracy: 100, pp: 35, effect: { type: 'poison', chance: 30 } },
    sludge_bomb: { name: 'Sludge Bomb', type: 'Poison', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 10, effect: { type: 'poison', chance: 30 } },
    acid: { name: 'Acid', type: 'Poison', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 30, effect: { type: 'stat_down', stat: 'spDefense', stages: 1, chance: 10 } },

    // Ground moves
    earthquake: { name: 'Earthquake', type: 'Ground', category: MOVE_CATEGORY.PHYSICAL, power: 100, accuracy: 100, pp: 10, effect: null },
    dig: { name: 'Dig', type: 'Ground', category: MOVE_CATEGORY.PHYSICAL, power: 80, accuracy: 100, pp: 10, effect: { type: 'charge' } },
    sand_attack: { name: 'Sand Attack', type: 'Ground', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 15, effect: { type: 'stat_down', stat: 'accuracy', stages: 1 } },

    // Flying moves
    gust: { name: 'Gust', type: 'Flying', category: MOVE_CATEGORY.SPECIAL, power: 40, accuracy: 100, pp: 35, effect: null },
    wing_attack: { name: 'Wing Attack', type: 'Flying', category: MOVE_CATEGORY.PHYSICAL, power: 60, accuracy: 100, pp: 35, effect: null },
    fly: { name: 'Fly', type: 'Flying', category: MOVE_CATEGORY.PHYSICAL, power: 90, accuracy: 95, pp: 15, effect: { type: 'charge' } },
    peck: { name: 'Peck', type: 'Flying', category: MOVE_CATEGORY.PHYSICAL, power: 35, accuracy: 100, pp: 35, effect: null },
    drill_peck: { name: 'Drill Peck', type: 'Flying', category: MOVE_CATEGORY.PHYSICAL, power: 80, accuracy: 100, pp: 20, effect: null },

    // Psychic moves
    confusion: { name: 'Confusion', type: 'Psychic', category: MOVE_CATEGORY.SPECIAL, power: 50, accuracy: 100, pp: 25, effect: { type: 'confuse', chance: 10 } },
    psychic: { name: 'Psychic', type: 'Psychic', category: MOVE_CATEGORY.SPECIAL, power: 90, accuracy: 100, pp: 10, effect: { type: 'stat_down', stat: 'spDefense', stages: 1, chance: 10 } },
    hypnosis: { name: 'Hypnosis', type: 'Psychic', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 60, pp: 20, effect: { type: 'sleep' } },

    // Bug moves
    string_shot: { name: 'String Shot', type: 'Bug', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 95, pp: 40, effect: { type: 'stat_down', stat: 'speed', stages: 1 } },
    bug_bite: { name: 'Bug Bite', type: 'Bug', category: MOVE_CATEGORY.PHYSICAL, power: 60, accuracy: 100, pp: 20, effect: null },
    signal_beam: { name: 'Signal Beam', type: 'Bug', category: MOVE_CATEGORY.SPECIAL, power: 75, accuracy: 100, pp: 15, effect: { type: 'confuse', chance: 10 } },

    // Rock moves
    rock_throw: { name: 'Rock Throw', type: 'Rock', category: MOVE_CATEGORY.PHYSICAL, power: 50, accuracy: 90, pp: 15, effect: null },
    rock_slide: { name: 'Rock Slide', type: 'Rock', category: MOVE_CATEGORY.PHYSICAL, power: 75, accuracy: 90, pp: 10, effect: { type: 'flinch', chance: 30 } },

    // Ghost moves
    lick: { name: 'Lick', type: 'Ghost', category: MOVE_CATEGORY.PHYSICAL, power: 30, accuracy: 100, pp: 30, effect: { type: 'paralyze', chance: 30 } },
    shadow_ball: { name: 'Shadow Ball', type: 'Ghost', category: MOVE_CATEGORY.SPECIAL, power: 80, accuracy: 100, pp: 15, effect: { type: 'stat_down', stat: 'spDefense', stages: 1, chance: 20 } },
    night_shade: { name: 'Night Shade', type: 'Ghost', category: MOVE_CATEGORY.SPECIAL, power: 0, accuracy: 100, pp: 15, effect: { type: 'level_damage' } },

    // Dragon moves
    dragon_rage: { name: 'Dragon Rage', type: 'Dragon', category: MOVE_CATEGORY.SPECIAL, power: 0, accuracy: 100, pp: 10, effect: { type: 'fixed_damage', damage: 40 } },
    dragon_claw: { name: 'Dragon Claw', type: 'Dragon', category: MOVE_CATEGORY.PHYSICAL, power: 80, accuracy: 100, pp: 15, effect: null },

    // Status moves
    growl: { name: 'Growl', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 40, effect: { type: 'stat_down', stat: 'attack', stages: 1 } },
    tail_whip: { name: 'Tail Whip', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 30, effect: { type: 'stat_down', stat: 'defense', stages: 1 } },
    leer: { name: 'Leer', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 30, effect: { type: 'stat_down', stat: 'defense', stages: 1 } },
    harden: { name: 'Harden', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 30, effect: { type: 'stat_up', stat: 'defense', stages: 1, target: 'self' } },
    swords_dance: { name: 'Swords Dance', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 20, effect: { type: 'stat_up', stat: 'attack', stages: 2, target: 'self' } },
    agility: { name: 'Agility', type: 'Psychic', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 30, effect: { type: 'stat_up', stat: 'speed', stages: 2, target: 'self' } },
    recover: { name: 'Recover', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 10, effect: { type: 'heal', amount: 0.5 } },
    rest: { name: 'Rest', type: 'Psychic', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 10, effect: { type: 'rest' } },
    toxic: { name: 'Toxic', type: 'Poison', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 90, pp: 10, effect: { type: 'badly_poison' } },
    protect: { name: 'Protect', type: 'Normal', category: MOVE_CATEGORY.STATUS, power: 0, accuracy: 100, pp: 10, priority: 4, effect: { type: 'protect' } }
};

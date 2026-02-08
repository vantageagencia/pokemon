// Map definitions
// Tile codes:
// G=grass, T=tall_grass, P=path, W=water, t=tree, w=wall, f=floor, d=door
// R=roof, n=fence, F=flower_grass, s=sign, h=pokecenter_floor, m=mart_shelf
// L=ledge, c=pc
// Collision: 0=walkable, 1=solid, 2=tall_grass, 3=water, 4=warp, 5=sign, 6=npc, 7=ledge

const Maps = {
    // ============= PALLET TOWN =============
    pallet_town: {
        name: 'Pallet Town',
        width: 25,
        height: 20,
        music: 'overworld',
        tiles: [
            'ttttttttttttttttttttttttt',
            'tGGGGGGGGGGGGGGGGGGGGGGt',
            'tGGRRRGGGGGGGGGRRRGGGGGt',
            'tGGRRRGGGGGGGGGRRRGGGGGt',
            'tGGwwwGGGGGGGGGwwwGGGGGt',
            'tGGwdwGGPPPPGGGwdwGGGGGt',
            'tGGGGGGGPGGPGGGGGGGGGGGt',
            'tGGGGGGGPGGPGGGGGGGGGGGt',
            'tGGGGGGGPGGPGGGGGGGFFFGt',
            'tGGGGGGGPGGPGGGGGGGFFFGt',
            'tGGGsGGGPGGPGGGGGGGFFFGt',
            'tGGGGGGGPGGPGGGGGGGGGGGt',
            'tGGGGGGGPGGPGGGGGGGGGGGt',
            'tGGGRRRGPGGPGGGGGWWWWGGt',
            'tGGGRRRGPGGPGGGGGWWWWGGt',
            'tGGGwwwGPGGPGGGGGWWWWGGt',
            'tGGGwdwGPGGPGGGGGGGGGGGt',
            'tGGGGGGGPGGPGGGGGGGGGGGt',
            'tGGGGGGGPGGPPPPPPPPPPPPP',
            'ttttttttttttttttttttttttt'
        ],
        collisionMap: null, // Generated from tiles
        warps: [
            { x: 4, y: 5, targetMap: 'player_house', targetX: 3, targetY: 7 },
            { x: 15, y: 5, targetMap: 'rival_house', targetX: 3, targetY: 7 },
            { x: 4, y: 16, targetMap: 'oak_lab', targetX: 5, targetY: 11 },
            { x: 24, y: 18, targetMap: 'route_1', targetX: 0, targetY: 18 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'oak_outside', sprite: 'npc_scientist', x: 10, y: 10, dir: DIR.DOWN,
              dialog: "I'm Prof. Oak! Come to my lab, I have something for you!" },
            { id: 'girl_pallet', sprite: 'npc_female', x: 18, y: 8, dir: DIR.LEFT,
              dialog: "This is Pallet Town. It's a small and quiet place." }
        ],
        signs: [
            { x: 4, y: 10, text: "PALLET TOWN - Shades of your journey await!" }
        ]
    },

    // ============= PLAYER HOUSE =============
    player_house: {
        name: "Player's House",
        width: 8,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwww',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wwwfdwww'
        ],
        warps: [
            { x: 3, y: 7, targetMap: 'pallet_town', targetX: 4, targetY: 6 },
            { x: 4, y: 7, targetMap: 'pallet_town', targetX: 4, targetY: 6 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'mom', sprite: 'npc_female', x: 2, y: 3, dir: DIR.DOWN,
              dialog: "Good luck on your Pokemon adventure, dear! Come back home safely!" }
        ],
        signs: []
    },

    // ============= RIVAL HOUSE =============
    rival_house: {
        name: "Rival's House",
        width: 8,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwww',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wwwfdwww'
        ],
        warps: [
            { x: 3, y: 7, targetMap: 'pallet_town', targetX: 15, targetY: 6 },
            { x: 4, y: 7, targetMap: 'pallet_town', targetX: 15, targetY: 6 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'rival_sis', sprite: 'npc_female', x: 5, y: 3, dir: DIR.LEFT,
              dialog: "My brother Blue is always so impatient. He already left for the lab!" }
        ],
        signs: []
    },

    // ============= OAK'S LAB =============
    oak_lab: {
        name: "Prof. Oak's Lab",
        width: 10,
        height: 12,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwwwww',
            'wffffffffw',
            'wfcffffffw',
            'wffffffffw',
            'wffffffffw',
            'wfffSSfffw',
            'wfffSSfffw',
            'wfffSSfffw',
            'wffffffffw',
            'wffffffffw',
            'wffffffffw',
            'wwwwfdwwww'
        ],
        warps: [
            { x: 4, y: 11, targetMap: 'pallet_town', targetX: 4, targetY: 17 },
            { x: 5, y: 11, targetMap: 'pallet_town', targetX: 4, targetY: 17 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'oak_lab', sprite: 'npc_scientist', x: 5, y: 3, dir: DIR.DOWN,
              dialog: null, // Handled by starter selection event
              event: 'starter_select' },
            { id: 'lab_aide', sprite: 'npc_male', x: 8, y: 5, dir: DIR.LEFT,
              dialog: "Prof. Oak has been studying Pokemon for decades!" }
        ],
        signs: [],
        starterTable: { x: 4, y: 5 } // Location of the starter Pokemon table
    },

    // ============= ROUTE 1 =============
    route_1: {
        name: 'Route 1',
        width: 20,
        height: 30,
        music: 'overworld',
        tiles: [
            'PPPPPPPPPtttttttttttt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGTTTGGGt',
            'tGGTTGGPPGGGGTTTGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTTGPPGTTGGGGGGGt',
            'tGGTTTGPPGTTGGGGGGGt',
            'tGGTTTGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGTTTTGGGGt',
            'tGGGGGGPPGGTTTTGGGGt',
            'tGGGsGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGTTGGGGGGt',
            'tGGTTGGPPGGTTGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGTTTGGGt',
            'tGGGGGGPPGGGGTTTGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'PPPPPPPPPPPPPPPPPPPt'
        ],
        warps: [
            { x: 0, y: 0, targetMap: 'viridian_city', targetX: 9, targetY: 28, range: { x: 0, y: 0, w: 9, h: 1 } },
            { x: 0, y: 29, targetMap: 'pallet_town', targetX: 23, targetY: 18, range: { x: 0, y: 29, w: 18, h: 1 } }
        ],
        wildPokemon: {
            grass: [
                { species: 'pidgey', minLevel: 2, maxLevel: 5, weight: 50 },
                { species: 'rattata', minLevel: 2, maxLevel: 5, weight: 50 }
            ],
            encounterRate: 20
        },
        npcs: [
            { id: 'route1_guy', sprite: 'npc_male', x: 5, y: 14, dir: DIR.RIGHT,
              dialog: "If your Pokemon is hurt, go back to Pallet Town and rest!" }
        ],
        signs: [
            { x: 4, y: 14, text: "ROUTE 1 - Pallet Town to Viridian City" }
        ]
    },

    // ============= VIRIDIAN CITY =============
    viridian_city: {
        name: 'Viridian City',
        width: 25,
        height: 30,
        music: 'overworld',
        tiles: [
            'ttttttttttttttttttttttttt',
            'tGGGGGGGGGGGGGGGGGGGGGGt',
            'tGGRRRGGGGGGGGGRRRGGGGGt',
            'tGGRRRGGGGGGGGGRRRGGGGGt',
            'tGGwwwGGGGPPGGGwwwGGGGGt',
            'tGGwdwGGGGPPGGGwdwGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGsGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPPPPPPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGTTTGGGGGPPGGGGPPGGGGGt',
            'tGTTTGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGPPGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tttttttttPPPPPPtttttttttt'
        ],
        warps: [
            { x: 4, y: 5, targetMap: 'pokemon_center', targetX: 4, targetY: 7 },
            { x: 15, y: 5, targetMap: 'pokemart', targetX: 3, targetY: 7 },
            { x: 9, y: 29, targetMap: 'route_1', targetX: 7, targetY: 0, range: { x: 9, y: 29, w: 6, h: 1 } },
            { x: 15, y: 11, targetMap: 'route_2', targetX: 7, targetY: 24, range: { x: 15, y: 11, w: 2, h: 1 } }
        ],
        wildPokemon: {
            grass: [
                { species: 'rattata', minLevel: 3, maxLevel: 6, weight: 40 },
                { species: 'pidgey', minLevel: 3, maxLevel: 6, weight: 40 },
                { species: 'nidoran_m', minLevel: 4, maxLevel: 6, weight: 20 }
            ],
            encounterRate: 20
        },
        npcs: [
            { id: 'viridian_old_man', sprite: 'npc_male', x: 5, y: 9, dir: DIR.DOWN,
              dialog: "You can catch wild Pokemon with Poke Balls! Try throwing one when a wild Pokemon appears." },
            { id: 'trainer_lass1', sprite: 'npc_female', x: 3, y: 18, dir: DIR.RIGHT,
              trainerId: 'lass_1', trainer: true }
        ],
        signs: [
            { x: 3, y: 9, text: "VIRIDIAN CITY - The Eternally Green Paradise" }
        ]
    },

    // ============= POKEMON CENTER =============
    pokemon_center: {
        name: 'Pokemon Center',
        width: 9,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwwww',
            'wfhhhhhfw',
            'wfffffffw',
            'wfcfffffw',
            'wfffffffw',
            'wfffffffw',
            'wffffffffw',
            'wwwwfdwww'
        ],
        warps: [
            { x: 4, y: 7, targetMap: 'viridian_city', targetX: 4, targetY: 6 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'nurse', sprite: 'npc_nurse', x: 4, y: 1, dir: DIR.DOWN,
              dialog: null, event: 'heal_pokemon' },
            { id: 'pc_center_guy', sprite: 'npc_male', x: 7, y: 4, dir: DIR.LEFT,
              dialog: "Pokemon Centers heal your Pokemon for free!" }
        ],
        signs: [],
        healTile: { x: 4, y: 1 }
    },

    // ============= POKEMART =============
    pokemart: {
        name: 'Poke Mart',
        width: 8,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwww',
            'wffffffw',
            'wmffffmw',
            'wmffffmw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wwwfdwww'
        ],
        warps: [
            { x: 3, y: 7, targetMap: 'viridian_city', targetX: 15, targetY: 6 },
            { x: 4, y: 7, targetMap: 'viridian_city', targetX: 15, targetY: 6 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'shopkeeper', sprite: 'npc_shopkeeper', x: 3, y: 1, dir: DIR.DOWN,
              dialog: null, event: 'shop',
              shopItems: ['pokeball', 'great_ball', 'potion', 'super_potion', 'antidote', 'paralyze_heal', 'awakening', 'repel'] }
        ],
        signs: []
    },

    // ============= ROUTE 2 =============
    route_2: {
        name: 'Route 2',
        width: 20,
        height: 25,
        music: 'overworld',
        tiles: [
            'PPPPPPPPPtttttttttttt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGTTGGGGt',
            'tGGTTGGPPGGGGTTGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGTTTGGPPGGTTGGGGGGt',
            'tGTTTGGPPGGTTGGGGGGt',
            'tGTTTGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGTTTGGGGGt',
            'tGGGGGGPPGGTTTGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGsGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGGGGGGGt',
            'tGGTTGGPPGGGGTTGGGGt',
            'tGGGGGGPPGGGGTTGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tGGGGGGPPGGGGGGGGGGt',
            'tttttttPPPPPPPtttttt'
        ],
        warps: [
            { x: 0, y: 0, targetMap: 'pewter_city', targetX: 9, targetY: 28, range: { x: 0, y: 0, w: 9, h: 1 } },
            { x: 7, y: 24, targetMap: 'viridian_city', targetX: 15, targetY: 12, range: { x: 7, y: 24, w: 6, h: 1 } }
        ],
        wildPokemon: {
            grass: [
                { species: 'pidgey', minLevel: 3, maxLevel: 7, weight: 35 },
                { species: 'rattata', minLevel: 3, maxLevel: 7, weight: 30 },
                { species: 'caterpie', minLevel: 3, maxLevel: 5, weight: 15 },
                { species: 'weedle', minLevel: 3, maxLevel: 5, weight: 15 },
                { species: 'nidoran_m', minLevel: 4, maxLevel: 6, weight: 5 }
            ],
            encounterRate: 25
        },
        npcs: [
            { id: 'trainer_bug1', sprite: 'npc_male', x: 5, y: 7, dir: DIR.RIGHT,
              trainerId: 'bug_catcher_1', trainer: true },
            { id: 'trainer_youngster1', sprite: 'npc_male', x: 12, y: 13, dir: DIR.LEFT,
              trainerId: 'youngster_1', trainer: true }
        ],
        signs: [
            { x: 3, y: 17, text: "ROUTE 2 - Viridian City to Pewter City" }
        ]
    },

    // ============= PEWTER CITY =============
    pewter_city: {
        name: 'Pewter City',
        width: 25,
        height: 30,
        music: 'overworld',
        tiles: [
            'ttttttttttttttttttttttttt',
            'tGGGGGGGGGGGGGGGGGGGGGGt',
            'tGGRRRGGGGGGGGGGGGGGGGGt',
            'tGGRRRGGGGGGGGGGGGGGGGGt',
            'tGGwwwGGGGPPGGGGGGGGGGGt',
            'tGGwdwGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGRRRGGGGGGt',
            'tGGGGGGGGGPPGGRRRGGGGGGt',
            'tGGGGGGGGGPPGGwwwGGGGGGt',
            'tGGGGGGGGGPPGGwdwGGGGGGt',
            'tGsGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPPPPPPPPGGGGt',
            'tGGGGGGGGGPPGGGGGPPGGGGt',
            'tGGGRRRGGGPPGGGGGPPGGGGt',
            'tGGGRRRGGGPPGGGGGPPGGGGt',
            'tGGGwwwGGGPPGGGGGPPGGGGt',
            'tGGGwdwGGGPPGGGGGPPGGGGt',
            'tGGGGGGGGGPPGGGGGPPGGGGt',
            'tGGGGGGGGGPPGGGGGPPGGGGt',
            'tGGGGGGGGGPPGGGGGPPGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tGGGGGGGGGPPGGGGGGGGGGGt',
            'tttttttttPPPPPPtttttttttt'
        ],
        warps: [
            { x: 4, y: 5, targetMap: 'pokemon_center_pewter', targetX: 4, targetY: 7 },
            { x: 14, y: 10, targetMap: 'pewter_gym', targetX: 4, targetY: 9 },
            { x: 4, y: 18, targetMap: 'pokemart_pewter', targetX: 3, targetY: 7 },
            { x: 9, y: 29, targetMap: 'route_2', targetX: 7, targetY: 0, range: { x: 9, y: 29, w: 6, h: 1 } }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'pewter_guide', sprite: 'npc_male', x: 6, y: 11, dir: DIR.RIGHT,
              dialog: "Brock is the Gym Leader here. He uses Rock-type Pokemon. Water and Grass types work well!" }
        ],
        signs: [
            { x: 2, y: 11, text: "PEWTER CITY - A Stone Gray City" }
        ]
    },

    // ============= PEWTER GYM =============
    pewter_gym: {
        name: 'Pewter City Gym',
        width: 9,
        height: 10,
        music: 'overworld',
        tiles: [
            'wwwwwwwww',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wwwwfdwww'
        ],
        warps: [
            { x: 4, y: 9, targetMap: 'pewter_city', targetX: 14, targetY: 11 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'gym_leader_brock', sprite: 'npc_male', x: 4, y: 2, dir: DIR.DOWN,
              trainerId: 'gym_leader_1', trainer: true },
            { id: 'hiker_gym', sprite: 'npc_male', x: 3, y: 6, dir: DIR.DOWN,
              trainerId: 'hiker_1', trainer: true }
        ],
        signs: []
    },

    // ============= POKEMON CENTER PEWTER =============
    pokemon_center_pewter: {
        name: 'Pokemon Center',
        width: 9,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwwww',
            'wfhhhhhfw',
            'wfffffffW',
            'wfcfffffW',
            'wfffffffW',
            'wfffffffW',
            'wfffffffW',
            'wwwwfdwww'
        ],
        warps: [
            { x: 4, y: 7, targetMap: 'pewter_city', targetX: 4, targetY: 6 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'nurse_pewter', sprite: 'npc_nurse', x: 4, y: 1, dir: DIR.DOWN,
              dialog: null, event: 'heal_pokemon' }
        ],
        signs: []
    },

    // ============= POKEMART PEWTER =============
    pokemart_pewter: {
        name: 'Poke Mart',
        width: 8,
        height: 8,
        music: 'pokemon_center',
        tiles: [
            'wwwwwwww',
            'wffffffw',
            'wmffffmw',
            'wmffffmw',
            'wffffffw',
            'wffffffw',
            'wffffffw',
            'wwwfdwww'
        ],
        warps: [
            { x: 3, y: 7, targetMap: 'pewter_city', targetX: 4, targetY: 19 },
            { x: 4, y: 7, targetMap: 'pewter_city', targetX: 4, targetY: 19 }
        ],
        wildPokemon: null,
        npcs: [
            { id: 'shopkeeper_pewter', sprite: 'npc_shopkeeper', x: 3, y: 1, dir: DIR.DOWN,
              dialog: null, event: 'shop',
              shopItems: ['pokeball', 'great_ball', 'potion', 'super_potion', 'hyper_potion', 'antidote', 'paralyze_heal', 'awakening', 'burn_heal', 'escape_rope', 'repel'] }
        ],
        signs: []
    }
};

// Generate collision maps from tile data
function generateCollisionMap(map) {
    const collisionTypes = {
        't': 1, // tree - solid
        'w': 1, // wall - solid
        'W': 1, // water wall - solid
        'R': 1, // roof - solid
        'm': 1, // mart shelf - solid
        'n': 1, // fence - solid
        'G': 0, // grass - walkable
        'P': 0, // path - walkable
        'f': 0, // floor - walkable
        'F': 0, // flower - walkable
        'T': 2, // tall grass - encounter
        'W': 3, // water - not walkable
        'd': 4, // door - warp
        'D': 4, // door
        's': 5, // sign
        'S': 0, // special floor - walkable
        'h': 0, // pokecenter floor - walkable
        'c': 0, // pc - walkable
        'L': 7  // ledge
    };

    map.collisionMap = [];
    for (let y = 0; y < map.tiles.length; y++) {
        map.collisionMap[y] = [];
        for (let x = 0; x < map.tiles[y].length; x++) {
            const tile = map.tiles[y][x];
            map.collisionMap[y][x] = collisionTypes[tile] !== undefined ? collisionTypes[tile] : 0;
        }
    }

    // Mark NPC positions as solid
    if (map.npcs) {
        map.npcs.forEach(npc => {
            if (npc.x < map.width && npc.y < map.height) {
                map.collisionMap[npc.y][npc.x] = 6;
            }
        });
    }
}

// Initialize all maps
Object.keys(Maps).forEach(key => generateCollisionMap(Maps[key]));

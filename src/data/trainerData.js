// Trainer data for NPCs
const TrainerDB = {
    bug_catcher_1: {
        class: 'Bug Catcher', name: 'Rick',
        pokemon: [
            { species: 'caterpie', level: 6 },
            { species: 'weedle', level: 6 }
        ],
        reward: 120,
        defeated: false,
        beforeText: "Hi! I like shorts! They're comfy and easy to wear!",
        afterText: "You're really strong!",
        defeatText: "Wow, you beat my bugs!"
    },
    youngster_1: {
        class: 'Youngster', name: 'Joey',
        pokemon: [
            { species: 'rattata', level: 8 }
        ],
        reward: 160,
        defeated: false,
        beforeText: "My Rattata is in the top percentage of Rattata!",
        afterText: "My Rattata really is the best...",
        defeatText: "That can't be! My Rattata!"
    },
    lass_1: {
        class: 'Lass', name: 'Sally',
        pokemon: [
            { species: 'oddish', level: 8 },
            { species: 'pidgey', level: 7 }
        ],
        reward: 200,
        defeated: false,
        beforeText: "Let's have a Pokemon battle!",
        afterText: "That was a good battle.",
        defeatText: "Oh no, I lost!"
    },
    hiker_1: {
        class: 'Hiker', name: 'Marcos',
        pokemon: [
            { species: 'geodude', level: 10 },
            { species: 'geodude', level: 10 }
        ],
        reward: 320,
        defeated: false,
        beforeText: "I've trained in the mountains!",
        afterText: "The mountains made me strong.",
        defeatText: "My rocks crumbled!"
    },
    rival: {
        class: 'Rival', name: 'Blue',
        pokemon: [], // Set dynamically based on player starter
        reward: 500,
        defeated: false,
        beforeText: "Hey! Let's see how strong you've gotten!",
        afterText: "Not bad... I'll beat you next time!",
        defeatText: "What!? I can't believe I lost!"
    },
    gym_leader_1: {
        class: 'Gym Leader', name: 'Brock',
        pokemon: [
            { species: 'geodude', level: 12 },
            { species: 'geodude', level: 14 }
        ],
        reward: 1400,
        defeated: false,
        beforeText: "I'm Brock! I'm the Pewter City Gym Leader! My rock-hard willpower is evident in my Pokemon!",
        afterText: "Take this, the Boulder Badge! As proof of your strength!",
        defeatText: "Your Pokemon's power is incredible!",
        badge: 'Boulder Badge'
    },
    gym_leader_2: {
        class: 'Gym Leader', name: 'Misty',
        pokemon: [
            { species: 'poliwag', level: 18 },
            { species: 'wartortle', level: 21 }
        ],
        reward: 2100,
        defeated: false,
        beforeText: "I'm the Cerulean City Gym Leader! My water Pokemon will wash you away!",
        afterText: "You really are talented! Here's the Cascade Badge!",
        defeatText: "Wow! You're too much!",
        badge: 'Cascade Badge'
    }
};

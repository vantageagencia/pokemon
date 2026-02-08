// Item database
const ItemDB = {
    pokeball: {
        name: 'Poke Ball', type: 'ball', price: 200, catchRate: 1,
        description: 'A ball for catching Pokemon.'
    },
    great_ball: {
        name: 'Great Ball', type: 'ball', price: 600, catchRate: 1.5,
        description: 'A good ball with a higher catch rate.'
    },
    ultra_ball: {
        name: 'Ultra Ball', type: 'ball', price: 1200, catchRate: 2,
        description: 'A high-performance ball.'
    },
    potion: {
        name: 'Potion', type: 'medicine', price: 300, healAmount: 20,
        description: 'Restores 20 HP to one Pokemon.'
    },
    super_potion: {
        name: 'Super Potion', type: 'medicine', price: 700, healAmount: 50,
        description: 'Restores 50 HP to one Pokemon.'
    },
    hyper_potion: {
        name: 'Hyper Potion', type: 'medicine', price: 1200, healAmount: 200,
        description: 'Restores 200 HP to one Pokemon.'
    },
    full_restore: {
        name: 'Full Restore', type: 'medicine', price: 3000, healAmount: 999, cureStatus: true,
        description: 'Fully restores HP and cures status.'
    },
    antidote: {
        name: 'Antidote', type: 'medicine', price: 100, cureStatus: 'poison',
        description: 'Cures poison.'
    },
    paralyze_heal: {
        name: 'Paralyze Heal', type: 'medicine', price: 200, cureStatus: 'paralyze',
        description: 'Cures paralysis.'
    },
    awakening: {
        name: 'Awakening', type: 'medicine', price: 250, cureStatus: 'sleep',
        description: 'Wakes a sleeping Pokemon.'
    },
    burn_heal: {
        name: 'Burn Heal', type: 'medicine', price: 250, cureStatus: 'burn',
        description: 'Heals a burned Pokemon.'
    },
    ice_heal: {
        name: 'Ice Heal', type: 'medicine', price: 250, cureStatus: 'freeze',
        description: 'Defrosts a frozen Pokemon.'
    },
    full_heal: {
        name: 'Full Heal', type: 'medicine', price: 600, cureStatus: true,
        description: 'Cures all status conditions.'
    },
    revive: {
        name: 'Revive', type: 'medicine', price: 1500, revive: true, healPercent: 0.5,
        description: 'Revives a fainted Pokemon to half HP.'
    },
    max_revive: {
        name: 'Max Revive', type: 'medicine', price: 4000, revive: true, healPercent: 1.0,
        description: 'Revives a fainted Pokemon to full HP.'
    },
    ether: {
        name: 'Ether', type: 'medicine', price: 0, ppRestore: 10,
        description: 'Restores 10 PP to one move.'
    },
    rare_candy: {
        name: 'Rare Candy', type: 'medicine', price: 0, levelUp: true,
        description: 'Raises a Pokemon by one level.'
    },
    escape_rope: {
        name: 'Escape Rope', type: 'key', price: 550,
        description: 'Escape from caves instantly.'
    },
    repel: {
        name: 'Repel', type: 'key', price: 350, repelSteps: 100,
        description: 'Repels weak Pokemon for 100 steps.'
    }
};

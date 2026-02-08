// Utility functions
const Utils = {
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    chance(percent) {
        return Math.random() * 100 < percent;
    },

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    distance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    },

    // Calculate Pokemon stat
    calcStat(base, iv, ev, level, nature = 1.0) {
        return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level / 100 + 5) * nature);
    },

    calcHP(base, iv, ev, level) {
        return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100 + level + 10);
    },

    // Experience needed for level (medium fast group)
    expForLevel(level) {
        return Math.floor(Math.pow(level, 3));
    },

    // Exp gained from defeating a pokemon
    expGain(baseExp, level, isTrainer) {
        const a = isTrainer ? 1.5 : 1;
        return Math.floor((a * baseExp * level) / 7);
    },

    // Catch rate calculation
    catchRate(pokemon, ballRate, statusBonus = 1) {
        const a = ((3 * pokemon.maxHp - 2 * pokemon.currentHp) * pokemon.catchRate * ballRate) / (3 * pokemon.maxHp);
        return Math.min(255, Math.floor(a * statusBonus));
    },

    // Deep clone
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Weighted random pick
    weightedRandom(items) {
        const total = items.reduce((sum, item) => sum + item.weight, 0);
        let r = Math.random() * total;
        for (const item of items) {
            r -= item.weight;
            if (r <= 0) return item;
        }
        return items[items.length - 1];
    },

    // Format number with leading zeros
    padNumber(num, length) {
        return String(num).padStart(length, '0');
    },

    // Create a promise that resolves after ms
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

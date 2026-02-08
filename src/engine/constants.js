// Game constants
const TILE_SIZE = 16;
const SCALE = 3;
const SCALED_TILE = TILE_SIZE * SCALE;
const VIEWPORT_WIDTH = 15;  // tiles visible horizontally (odd for centering)
const VIEWPORT_HEIGHT = 13; // tiles visible vertically
const CANVAS_WIDTH = VIEWPORT_WIDTH * TILE_SIZE * SCALE;
const CANVAS_HEIGHT = VIEWPORT_HEIGHT * TILE_SIZE * SCALE;
const MOVE_SPEED = 2; // pixels per frame at base
const PLAYER_MOVE_TIME = 8; // frames to move one tile
const FPS = 60;
const FRAME_TIME = 1000 / FPS;

// Game states
const STATE = {
    TITLE: 'title',
    OVERWORLD: 'overworld',
    BATTLE: 'battle',
    MENU: 'menu',
    DIALOG: 'dialog',
    PARTY: 'party',
    BAG: 'bag',
    POKEDEX: 'pokedex',
    SHOP: 'shop',
    EVOLUTION: 'evolution',
    TRANSITION: 'transition',
    POKEMON_CENTER: 'pokemon_center',
    PC: 'pc'
};

// Directions
const DIR = {
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
};

const DIR_OFFSET = {
    [DIR.DOWN]: { x: 0, y: 1 },
    [DIR.LEFT]: { x: -1, y: 0 },
    [DIR.RIGHT]: { x: 1, y: 0 },
    [DIR.UP]: { x: 0, y: -1 }
};

// Pokemon Types
const TYPES = {
    NORMAL: 'Normal',
    FIRE: 'Fire',
    WATER: 'Water',
    GRASS: 'Grass',
    ELECTRIC: 'Electric',
    ICE: 'Ice',
    FIGHTING: 'Fighting',
    POISON: 'Poison',
    GROUND: 'Ground',
    FLYING: 'Flying',
    PSYCHIC: 'Psychic',
    BUG: 'Bug',
    ROCK: 'Rock',
    GHOST: 'Ghost',
    DRAGON: 'Dragon'
};

// Battle states
const BATTLE_STATE = {
    INTRO: 'intro',
    ACTION_SELECT: 'action_select',
    MOVE_SELECT: 'move_select',
    ITEM_SELECT: 'item_select',
    SWITCH_SELECT: 'switch_select',
    EXECUTING: 'executing',
    ANIMATING: 'animating',
    TEXT: 'text',
    FAINT: 'faint',
    EXP: 'exp',
    LEVEL_UP: 'level_up',
    LEARN_MOVE: 'learn_move',
    EVOLVE: 'evolve',
    RUN: 'run',
    CATCH: 'catch',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    END: 'end'
};

// Colors matching GBC Pokemon style
const COLORS = {
    WHITE: '#f8f8f8',
    LIGHT: '#c0c0c0',
    DARK: '#686868',
    BLACK: '#181818',
    RED: '#e03030',
    BLUE: '#3060e0',
    GREEN: '#30a830',
    YELLOW: '#f8d030',
    BG: '#e8e8e0',
    MENU_BG: '#f8f8f8',
    MENU_BORDER: '#404040',
    HP_GREEN: '#30a830',
    HP_YELLOW: '#f8d030',
    HP_RED: '#e03030',
    EXP_BLUE: '#4088d0',
    TEXT: '#282828'
};

// Type colors for UI
const TYPE_COLORS = {
    Normal: '#a8a878',
    Fire: '#f08030',
    Water: '#6890f0',
    Grass: '#78c850',
    Electric: '#f8d030',
    Ice: '#98d8d8',
    Fighting: '#c03028',
    Poison: '#a040a0',
    Ground: '#e0c068',
    Flying: '#a890f0',
    Psychic: '#f85888',
    Bug: '#a8b820',
    Rock: '#b8a038',
    Ghost: '#705898',
    Dragon: '#7038f8'
};

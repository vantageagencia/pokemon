// Tile sprites for map rendering (16x16 each)
const TileSprites = {
    // Grass floor
    grass: [
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGgGGGGGG',
        'GGGGGgGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGgGGGG',
        'GGGgGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGgGG',
        'GGGGGGgGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGgGGGGGGGGGGGGG',
        'GGGGGGGGGGGgGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGgGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGgGG'
    ],

    // Tall grass (encounters)
    tall_grass: [
        'GGtGGGtGGGtGGGtG',
        'GGTGGGTGGGTGGGtG',
        'GTTGGTTGGTTGGTtG',
        'GTTGGTGGGTGGGTTG',
        'GTTGGTGGGTTGGTTG',
        'GTTGGTTGGTTGGTtG',
        'GGTGGGTGGGTGGGtG',
        'GGtGGGtGGGtGGGtG',
        'GGtGGGtGGGtGGGtG',
        'GGTGGGTGGGTGGGtG',
        'GTTGGTTGGTTGGTtG',
        'GTTGGTGGGTGGGTTG',
        'GTTGGTGGGTTGGTTG',
        'GTTGGTTGGTTGGTtG',
        'GGTGGGTGGGTGGGtG',
        'GGtGGGtGGGtGGGtG'
    ],

    // Path/road
    path: [
        'ssssssssssssssss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'sSSSSSSSSSSSSSss',
        'ssSSSSSSSSSSSSss',
        'ssssssssssssssss'
    ],

    // Tree (solid)
    tree: [
        'GGGGttttttttGGGG',
        'GGGtTTTTTTTtGGGG',
        'GGtTTTTTTTTTtGGG',
        'GtTTTTTTTTTTTtGG',
        'GtTTTTTTTTTTTtGG',
        'tTTTTTTTTTTTTTtG',
        'tTTTTTTTTTTTTTtG',
        'tTTTTTTTTTTTTTtG',
        'GtTTTTTTTTTTTtGG',
        'GGtTTTTTTTTTtGGG',
        'GGGGtt1111ttGGGG',
        'GGGG11111111GGGG',
        'GGGG11111111GGGG',
        'GGGG11111111GGGG',
        'GGGG11111111GGGG',
        'GGGGGGGGGGGGGGGG'
    ],

    // Water
    water: [
        'WWWWWWWWWWWWWWWW',
        'WWwWWWWWwWWWWwWW',
        'WwwwWWWwwwWWwwwW',
        'WWwWWWWWwWWWWwWW',
        'WWWWWWWWWWWWWWWW',
        'WWWWwWWWWWwWWWWW',
        'WWWwwwWWWwwwWWWW',
        'WWWWwWWWWWwWWWWW',
        'WWWWWWWWWWWWWWWW',
        'WWwWWWWWwWWWWwWW',
        'WwwwWWWwwwWWwwwW',
        'WWwWWWWWwWWWWwWW',
        'WWWWWWWWWWWWWWWW',
        'WWWWwWWWWWwWWWWW',
        'WWWwwwWWWwwwWWWW',
        'WWWWwWWWWWwWWWWW'
    ],

    // House wall
    wall: [
        'cccccccccccccccc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'cCCCCCCCCCCCCCcc',
        'ccCCCCCCCCCCCCcc',
        'cccccccccccccccc'
    ],

    // Floor (inside)
    floor: [
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS'
    ],

    // Door
    door: [
        'cccccccccccccccc',
        'cc11111111111ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc100011000 1ccc',
        'cc100011000 1ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc10000000001ccc',
        'cc11111111111ccc',
        'cccccccccccccccc'
    ],

    // Roof
    roof: [
        'RRRRRRRRRRRRRRRR',
        'RRrrRRRRRRRRrrRR',
        'RRrrRRRRRRRRrrRR',
        'RRRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRRR',
        'RRrrRRRRRRRRrrRR',
        'RRrrRRRRRRRRrrRR',
        'RRRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRRR',
        'RRrrRRRRRRRRrrRR',
        'RRrrRRRRRRRRrrRR',
        'RRRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRRR',
        'RRrrRRRRRRRRrrRR',
        'RRrrRRRRRRRRrrRR',
        'RRRRRRRRRRRRRRRR'
    ],

    // Fence
    fence: [
        'GGGG1GGG1GGGGGGG',
        'GGG111G111GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1s1s1GGGGGG',
        'GGG1sssss1GGGGGG',
        'GGG1s1s1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG1s1G1s1GGGGGG',
        'GGG111G111GGGGGG',
        'GGGG1GGG1GGGGGGG'
    ],

    // Flower grass
    flower_grass: [
        'GGGGGGGGGGGGGGRG',
        'GGGRGGGGGRGGGGGG',
        'GGGGGGYGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GRGGGGGGGGYRGGGG',
        'GGGGGYGGGGGGGGGG',
        'GGGGGGGGGGGRGGGG',
        'GGRGGGGGGGGGGGRG',
        'GGGGGRGGGGGGGGGG',
        'GGGGGGGGYGGGGGRG',
        'GGRGGGGGGGGGRGRG',
        'GGGGGGGGGGGGGGGG',
        'GGRGGYGGGGRGGGGG',
        'GGGGGGGGGGGGGGRG',
        'GGGGGGGGRGGRGGGG',
        'GGGRGGGGGGGGGGGG'
    ],

    // Sign
    sign: [
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGG11111111GGGG',
        'GGGG1ssssss1GGGG',
        'GGGG1s1111s1GGGG',
        'GGGG1s1111s1GGGG',
        'GGGG1ssssss1GGGG',
        'GGGG1ssssss1GGGG',
        'GGGG11111111GGGG',
        'GGGGGGG11GGGGGGG',
        'GGGGGGG11GGGGGGG',
        'GGGGGGG11GGGGGGG',
        'GGGGGGG11GGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG'
    ],

    // Pokecenter floor (healing tile)
    pokecenter_floor: [
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSRRRRRSSSSS S',
        'SSSSRRRRRRRSSSSS',
        'SSSRRR333RRRSSS S',
        'SSSRR33333RRSSS S',
        'SSSRR33R33RRSSSS',
        'SSSRR3RRR3RRSSSS',
        'SSSRR33R33RRSSSS',
        'SSSRR33333RRSSS S',
        'SSSRRR333RRRSSS S',
        'SSSSRRRRRRRSSSSS',
        'SSSSSRRRRRSSSSS S',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS'
    ],

    // Mart shelf
    mart_shelf: [
        'cccccccccccccccc',
        'c11111111111111c',
        'c1BBBBBBBBBBBB1c',
        'c1BRRBBRRBBRBB1c',
        'c1BGGGBBGGGBGB1c',
        'c1BYYBBBYYBBBB1c',
        'c1BBBBBBBBBBBB1c',
        'c11111111111111c',
        'c1BBBBBBBBBBBB1c',
        'c1BRRBBRRBBRBB1c',
        'c1BGGGBBGGGBGB1c',
        'c1BYYBBBYYBBBB1c',
        'c1BBBBBBBBBBBB1c',
        'c11111111111111c',
        'cccccccccccccccc',
        'cccccccccccccccc'
    ],

    // Ledge (jump down)
    ledge: [
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        '1111111111111111',
        'ggggggggggggggg1',
        'ttttttttttttttt1',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG'
    ],

    // PC computer
    pc: [
        'SSSSSSSSSSSSSSSS',
        'SSSS11111111SSSS',
        'SSSS1BBBBBB1SSSS',
        'SSSS1BBBBBB1SSSS',
        'SSSS1BBBBBB1SSSS',
        'SSSS1BBBBBB1SSSS',
        'SSSS1BBBBBB1SSSS',
        'SSSS11111111SSSS',
        'SSSSS111111SSSSS',
        'SSSS11cccc11SSSS',
        'SSSS1cccccc1SSSS',
        'SSSS1cccccc1SSSS',
        'SSSS11111111SSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSS'
    ],

    getTile(tileId) {
        return this[tileId] || this.grass;
    }
};

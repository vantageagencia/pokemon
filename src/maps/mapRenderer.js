// Map renderer - draws tiles and handles map transitions
const MapRenderer = {
    tileMapping: {
        'G': 'grass',
        'T': 'tall_grass',
        'P': 'path',
        'W': 'water',
        't': 'tree',
        'w': 'wall',
        'f': 'floor',
        'd': 'door',
        'R': 'roof',
        'n': 'fence',
        'F': 'flower_grass',
        's': 'sign',
        'S': 'floor',
        'h': 'pokecenter_floor',
        'm': 'mart_shelf',
        'L': 'ledge',
        'c': 'pc'
    },

    draw(ctx, map) {
        const startTileX = Math.max(0, Math.floor(Camera.x / SCALED_TILE) - 1);
        const startTileY = Math.max(0, Math.floor(Camera.y / SCALED_TILE) - 1);
        const endTileX = Math.min(map.width, startTileX + VIEWPORT_WIDTH + 3);
        const endTileY = Math.min(map.height, startTileY + VIEWPORT_HEIGHT + 3);

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                if (y >= map.tiles.length || x >= map.tiles[y].length) continue;

                const tileChar = map.tiles[y][x];
                const tileId = this.tileMapping[tileChar] || 'grass';
                const tileSprite = TileSprites.getTile(tileId);

                const screenPos = Camera.worldToScreen(x * SCALED_TILE, y * SCALED_TILE);
                SpriteRenderer.draw(ctx, tileSprite, screenPos.x, screenPos.y, SCALE);
            }
        }
    },

    drawAbovePlayer(ctx, map) {
        // Draw tree tops and roofs above the player
        const startTileX = Math.max(0, Math.floor(Camera.x / SCALED_TILE) - 1);
        const startTileY = Math.max(0, Math.floor(Camera.y / SCALED_TILE) - 1);
        const endTileX = Math.min(map.width, startTileX + VIEWPORT_WIDTH + 3);
        const endTileY = Math.min(map.height, startTileY + VIEWPORT_HEIGHT + 3);

        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                if (y >= map.tiles.length || x >= map.tiles[y].length) continue;
                const tileChar = map.tiles[y][x];

                // Only draw tree canopy overlay
                if (tileChar === 't') {
                    // Check if this tree tile is the top part (above other tree tiles)
                    if (y < map.tiles.length - 1 && map.tiles[y + 1][x] === 't') {
                        // This is an upper tree tile, draw canopy effect
                    }
                }
            }
        }
    }
};

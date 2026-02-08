// Camera system for viewport scrolling
const Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    smoothing: 0.15,

    update(playerPixelX, playerPixelY, mapWidth, mapHeight) {
        // Center on player
        this.targetX = playerPixelX - CANVAS_WIDTH / 2 + SCALED_TILE / 2;
        this.targetY = playerPixelY - CANVAS_HEIGHT / 2 + SCALED_TILE / 2;

        // Clamp to map bounds
        const maxX = mapWidth * SCALED_TILE - CANVAS_WIDTH;
        const maxY = mapHeight * SCALED_TILE - CANVAS_HEIGHT;
        this.targetX = Utils.clamp(this.targetX, 0, Math.max(0, maxX));
        this.targetY = Utils.clamp(this.targetY, 0, Math.max(0, maxY));

        // Smooth follow
        this.x = Math.round(Utils.lerp(this.x, this.targetX, this.smoothing));
        this.y = Math.round(Utils.lerp(this.y, this.targetY, this.smoothing));
    },

    snapTo(playerPixelX, playerPixelY, mapWidth, mapHeight) {
        this.targetX = playerPixelX - CANVAS_WIDTH / 2 + SCALED_TILE / 2;
        this.targetY = playerPixelY - CANVAS_HEIGHT / 2 + SCALED_TILE / 2;
        const maxX = mapWidth * SCALED_TILE - CANVAS_WIDTH;
        const maxY = mapHeight * SCALED_TILE - CANVAS_HEIGHT;
        this.targetX = Utils.clamp(this.targetX, 0, Math.max(0, maxX));
        this.targetY = Utils.clamp(this.targetY, 0, Math.max(0, maxY));
        this.x = this.targetX;
        this.y = this.targetY;
    },

    worldToScreen(wx, wy) {
        return {
            x: wx - this.x,
            y: wy - this.y
        };
    }
};

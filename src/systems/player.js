// Player system
const Player = {
    x: 8, // tile position
    y: 10,
    pixelX: 0,
    pixelY: 0,
    direction: DIR.DOWN,
    isMoving: false,
    moveProgress: 0,
    animFrame: 0,
    animTimer: 0,
    moveTargetX: 0,
    moveTargetY: 0,
    name: 'Red',
    money: 3000,
    badges: [],
    party: [],
    pc: [],
    pokedex: { seen: new Set(), caught: new Set() },
    repelSteps: 0,
    stepsInGrass: 0,
    currentMap: 'pallet_town',
    hasStarter: false,
    rivalStarter: null,

    init(startMap, startX, startY) {
        this.currentMap = startMap;
        this.x = startX;
        this.y = startY;
        this.pixelX = startX * SCALED_TILE;
        this.pixelY = startY * SCALED_TILE;
        this.isMoving = false;
    },

    update(map) {
        if (this.isMoving) {
            this.moveProgress++;
            const speed = Input.run ? PLAYER_MOVE_TIME / 2 : PLAYER_MOVE_TIME;

            const t = Math.min(1, this.moveProgress / speed);
            const startX = (this.x - DIR_OFFSET[this.direction].x) * SCALED_TILE;
            const startY = (this.y - DIR_OFFSET[this.direction].y) * SCALED_TILE;
            this.pixelX = Utils.lerp(startX, this.x * SCALED_TILE, t);
            this.pixelY = Utils.lerp(startY, this.y * SCALED_TILE, t);

            // Animate walk
            this.animTimer++;
            if (this.animTimer >= speed / 2) {
                this.animTimer = 0;
                this.animFrame = 1 - this.animFrame;
            }

            if (this.moveProgress >= speed) {
                this.isMoving = false;
                this.moveProgress = 0;
                this.pixelX = this.x * SCALED_TILE;
                this.pixelY = this.y * SCALED_TILE;
                this.animFrame = 0;

                // Check for encounters, warps, etc. after arriving at new tile
                return this._onTileArrival(map);
            }
            return null;
        }

        // Process input for new movement
        let newDir = null;
        if (Input.down) newDir = DIR.DOWN;
        else if (Input.up) newDir = DIR.UP;
        else if (Input.left) newDir = DIR.LEFT;
        else if (Input.right) newDir = DIR.RIGHT;

        if (newDir !== null) {
            this.direction = newDir;
            const offset = DIR_OFFSET[newDir];
            const newX = this.x + offset.x;
            const newY = this.y + offset.y;

            if (this._canMoveTo(newX, newY, map)) {
                this.x = newX;
                this.y = newY;
                this.isMoving = true;
                this.moveProgress = 0;
            } else {
                // Bump sound
                if (Input.isJustPressed('ArrowDown') || Input.isJustPressed('ArrowUp') ||
                    Input.isJustPressed('ArrowLeft') || Input.isJustPressed('ArrowRight')) {
                    Audio.playSfx('bump');
                }
            }
        }

        // Check for interaction
        if (Input.confirm && !this.isMoving) {
            return this._interact(map);
        }

        return null;
    },

    _canMoveTo(x, y, map) {
        if (x < 0 || y < 0 || y >= map.collisionMap.length || x >= map.collisionMap[0].length) {
            // Check if there's a warp at the edge
            const warp = this._getWarp(x, y, map);
            if (warp) return true;
            return false;
        }
        const collision = map.collisionMap[y][x];
        return collision === 0 || collision === 2 || collision === 4 || collision === 5;
    },

    _onTileArrival(map) {
        // Check warps
        const warp = this._getWarp(this.x, this.y, map);
        if (warp) {
            return { type: 'warp', warp };
        }

        // Check for wild encounter in tall grass
        if (map.collisionMap[this.y] && map.collisionMap[this.y][this.x] === 2) {
            if (this.repelSteps > 0) {
                this.repelSteps--;
            } else if (map.wildPokemon) {
                this.stepsInGrass++;
                const encounterChance = map.wildPokemon.encounterRate || 20;
                if (Utils.chance(encounterChance)) {
                    this.stepsInGrass = 0;
                    return { type: 'wild_encounter' };
                }
            }
        }

        return null;
    },

    _interact(map) {
        const offset = DIR_OFFSET[this.direction];
        const targetX = this.x + offset.x;
        const targetY = this.y + offset.y;

        // Check NPCs
        if (map.npcs) {
            for (const npc of map.npcs) {
                if (npc.x === targetX && npc.y === targetY) {
                    // Face the player
                    npc.dir = [DIR.UP, DIR.RIGHT, DIR.LEFT, DIR.DOWN][this.direction];
                    return { type: 'npc', npc };
                }
            }
        }

        // Check signs
        if (map.signs) {
            for (const sign of map.signs) {
                if (sign.x === targetX && sign.y === targetY) {
                    return { type: 'sign', sign };
                }
            }
        }

        // Check PC
        if (map.tiles[targetY] && map.tiles[targetY][targetX] === 'c') {
            return { type: 'pc' };
        }

        return null;
    },

    _getWarp(x, y, map) {
        if (!map.warps) return null;
        for (const warp of map.warps) {
            if (warp.range) {
                if (x >= warp.range.x && x < warp.range.x + warp.range.w &&
                    y >= warp.range.y && y < warp.range.y + warp.range.h) {
                    return warp;
                }
            } else if (warp.x === x && warp.y === y) {
                return warp;
            }
        }
        return null;
    },

    draw(ctx) {
        const dirName = CharacterSprites.getDirFromEnum(this.direction);
        const sprite = CharacterSprites.getSprite('player', dirName, this.isMoving ? this.animFrame : 0);
        const screenPos = Camera.worldToScreen(this.pixelX, this.pixelY);
        SpriteRenderer.draw(ctx, sprite, screenPos.x, screenPos.y, SCALE);
    },

    healParty() {
        this.party.forEach(p => {
            p.currentHp = p.maxHp;
            p.status = null;
            p.moves.forEach(m => { m.currentPp = m.maxPp; });
        });
    },

    addPokemon(pokemon) {
        if (this.party.length < 6) {
            this.party.push(pokemon);
        } else {
            this.pc.push(pokemon);
        }
        this.pokedex.caught.add(pokemon.speciesId);
        this.pokedex.seen.add(pokemon.speciesId);
    },

    getAlivePartyCount() {
        return this.party.filter(p => p.currentHp > 0).length;
    },

    getFirstAlive() {
        return this.party.find(p => p.currentHp > 0);
    }
};

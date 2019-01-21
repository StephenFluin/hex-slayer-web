import { gridHeight, gridWidth, villagerCost, castleCost, playerColors } from './config';
import { Tile } from './tile';
import { Player } from './player';
import { Castle, Villager, Village, Grave } from './pawns';

export class Game {
    tiles: Tile[][] = [];
    me: Player;
    players: Player[] = [];
    selectedRealm: { village: Village; upkeep: number; income: number } = null;

    carry: Castle | Villager = null;
    carrySource: Tile;

    constructor() {
        this.newGame();
    }

    newGame() {
        for (let i = 0; i < 3; i++) {
            this.players.push(new Player());
        }
        this.me = this.players[0];
        this.me.name = 'You';

        this.tiles = [];
        for (let y = 0; y < gridHeight; y++) {
            const row = [];
            for (let x = 0; x < gridWidth; x++) {
                row.push(new Tile(this, x, y));
            }
            this.tiles.push(row);
        }
        this.normalizeMap();
    }

    /**
     * Figure out where to join / split / spawn villages
     */
    normalizeMap() {
        // Clear realm data
        for (const row of this.tiles) {
            for (const tile of row) {
                tile.realm = null;
            }
        }

        // Define realms and correct villages
        for (const row of this.tiles) {
            for (const tile of row) {
                // Don't scan tiles that have already been processed
                if (!tile.realm) {
                    tile.realm = this.getTileSet(tile.x, tile.y);

                    // Count Villages
                    let villageCount = 0;
                    const villages: Tile[] = [];
                    for (const spot of tile.realm) {
                        if (spot.village) {
                            villageCount++;
                            villages.push(spot);
                        }
                    }

                    // If no villages, but realm warrants one
                    if (villages.length === 0 && tile.realm.length > 1) {
                        const dest: Tile = randomMember(tile.realm);
                        dest.village = new Village();
                        this.message(dest.player, 'Your region split');
                    }

                    // Remove and combine villages
                    while (villages.length > 1 || (villages.length > 0 && tile.realm.length < 2)) {
                        const dest = randomMember(villages, true);
                        if (villages.length > 0) {
                            randomMember(villages).village.balance += dest.village.balance;
                            dest.village = null;
                        }
                    }
                }
            }
        }
        // Check for endgame
        const owners = {};
        for (const row of this.tiles) {
            for (const tile of row) {
                if (tile.village) {
                    owners[tile.player.id] = true;
                }
            }
        }
        if (Object.keys(owners).length === 1) {
            this.gameOver(owners[Object.keys(owners)[0]]);
        }
    }

    // Given a tile position, return all connected tiles owned by same player
    getTileSet(x: number, y: number): Tile[] {
        const tile = this.tiles[y][x];
        const found: Tile[] = [tile];
        const toSearch = [tile];
        const searched = [];

        while (toSearch.length > 0) {
            const search = toSearch.pop();
            searched.push(search);

            for (let i = 0; i < 6; i++) {
                const considered: Tile = this.getAdjacent(search, i);
                // Found an adjacent tile of same color
                if (considered && search.player === considered.player) {
                    // We don't yet know about this tile
                    if (searched.indexOf(considered) === -1 && toSearch.indexOf(considered) === -1) {
                        toSearch.push(considered);
                    }
                    // Keep it if we don't have it already
                    if (found.indexOf(considered) === -1) {
                        found.push(considered);
                    }
                }
            }
        }
        return found;
    }

    // We define 0 as north, then go clockwise.
    getAdjacent(from: Tile, direction: number): Tile | null {
        const evenYChanges = [[0, -2], [0, -1], [0, 1], [0, 2], [-1, 1], [-1, -1]];
        const oddYChanges = [[0, -2], [1, -1], [1, 1], [0, 2], [0, 1], [0, -1]];
        const dirChanges = [evenYChanges, oddYChanges];
        const change = dirChanges[from.y % 2][direction];
        const x = from.x + change[0];
        const y = from.y + change[1];
        if (x >= 0 && y >= 0 && x < gridWidth && y < gridHeight) {
            return this.tiles[from.y + change[1]][from.x + change[0]];
        } else {
            return null;
        }
    }

    getRandomPlayer() {
        return this.players[Math.floor(Math.random() * this.players.length)];
    }

    newTurn() {
        // Remove graves
        for (const row of this.tiles) {
            for (const tile of row) {
                if (tile.pawn instanceof Grave) {
                    tile.pawn = null;
                }
            }
        }

        for (const row of this.tiles) {
            for (const tile of row) {
                const realm = tile.realm;
                const stats = this.calculateRealmStats(realm);

                // Do things once per villaged realm
                // Update balances from income and upkeep
                if (tile.village) {
                    tile.village.balance += stats.income - stats.upkeep;

                    // Starve random units with unmet upkeep and add back to balance
                    while (tile.village.balance < 0) {
                        shuffle(realm);
                        for (const deathTile of realm) {
                            if (deathTile.pawn && deathTile.pawn.upkeep > 0) {
                                tile.village.balance += deathTile.pawn.upkeep;
                                deathTile.pawn = null;
                                this.message(deathTile.player, 'Your unit died from unmet upkeep.');
                            }
                        }
                    }

                    // Mark villages as ready
                }

                // Remove pawns without village
                if (tile.pawn && realm.length < 2) {
                    tile.pawn = null;
                }
            }
        }

        this.selectedRealm = null;
    }

    gameOver(winner: Player) {
        this.message(winner, 'You win!');
    }

    /**
     * Send a message to the player
     * @TODO IMPLEMENT
     */
    message(player: Player, message) {
        console.log(`To ${player.name}, ${message}`);
    }
    // Select the set visually onscreen
    select(selectedTile: Tile) {
        // console.log('Selecting tile',selectedTile);
        this.selectedRealm = null;
        for (const row of this.tiles) {
            for (const tile of row) {
                tile.selected = false;
            }
        }
        if (!selectedTile) {
            return;
        }
        const set = this.getTileSet(selectedTile.x, selectedTile.y);
        for (const tile of set) {
            tile.selected = true;
        }
        this.selectedRealm = this.calculateRealmStats(set);
    }

    /**
     * income: 1 gold per tile in the set
     * village: the tile with the village on it
     * upkeep: total upkeep for all units in set
     */
    calculateRealmStats(set: Tile[]) {
        let village = null,
            upkeep = 0;
        for (const tile of set) {
            if (tile.pawn) {
                upkeep += tile.pawn.upkeep;
            }
            if (tile.village) {
                village = tile.village;
            }
        }
        if (!village) {
            return null;
        }
        return { upkeep: upkeep, income: set.length, village: village, tiles: set };
    }

    /**
     * Buy a villager from the identified village and place it at the target coordinates.
     * We assume in this method that the viability of attacks have already been resolved.
     */
    buyVillager(targetX: number, targetY: number, village: Village) {
        village.balance -= villagerCost;
        const tile = this.tiles[targetY][targetX];
        tile.pawn = new Villager();

    }
    moveVillager(targetX: number, targetY: number, sourceX: number, sourceY: number) {

    }
    buyCastle(targetX: number, targetY: number, village: Village) {
        village.balance -= castleCost;
        this.carry = new Castle();
    }
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function randomMember<T>(list: T[], remove = false): T {
    const index = randInt(list.length);
    if (remove) {
        return list.splice(index, 1)[0];
    } else {
        return list[index];
    }
}

/**
 * In place array shuffle
 */
function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

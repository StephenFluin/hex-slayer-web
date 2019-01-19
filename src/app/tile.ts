import { Game } from './game';
import { Pawn, Village } from './pawns';
import { Player } from './player';

export class Tile {
    game: Game;

    player: Player;
    x: number;
    y: number;
    pawn: Pawn;
    village: Village;
    realm: Tile[];
    selected = false;
    ready = false;

    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.setPlayer(game.getRandomPlayer());
    }

    setPlayer(player: Player) {
        this.player = player;
    }
    select() {
        this.game.select(this);
    }
}

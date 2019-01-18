import { Game } from './game';
import { Pawn, Village } from './pawns';

export class Tile {
  game: Game;

  player:number;
  x: number;
  y: number;
  pawn: Pawn;
  village: Village;
  realm: Tile[];
  selected = false;
  ready = false;

  constructor(game, x,y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.setPlayer(Math.random()*5);
  }

  setPlayer(player) {
    this.player =Math.floor(player);
  }
  select() {
    this.game.select(this);
  }
}
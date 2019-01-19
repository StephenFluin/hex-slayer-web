import { playerColors } from './config';

export class Player {
  static playerCount = 0;

  id: number;
  name: string;
  color: string;

  constructor() {
    Player.playerCount++;
    this.id = Player.playerCount;
    this.name = `Player ${this.id}`;
    this.color = playerColors[this.id];
  }
}

import { Component, Input } from '@angular/core';
import { Tile } from '../../tile';
import { playerColors } from '../../config';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.css']
})
export class HexComponent {
  // @Input() color: string = '#00CCCC';
  color;
  @Input() size = 100;
  @Input() tile: Tile;

  width;
  height;


  points: string;

  constructor() {
    // this.ngOnChanges();
  }
  ngOnInit() {
    this.update();
  }
  update() {
    const width = this.width = this.size;
    const height
      = this.height
      = this.size / 2 * Math.sqrt(3);
    this.points =
      width + ',' + height
      / 2 + ' ' +
      width / 4 * 3 + ',' + height
      + ' ' +
      width / 4 * 1 + ',' + height
      + ' ' +
      width * 0 + ',' + height
      / 2 + ' ' +
      width / 4 * 1 + ',' + 0 + ' ' +
      width / 4 * 3 + ',' + 0;

    this.color = playerColors[this.tile.player.id];

  }
  click() {
      this.tile.select();
  }




}

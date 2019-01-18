import { Component } from '@angular/core';
import { Game } from './game';

import { gridWidth, gridHeight} from './config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  gridWidth = gridWidth;
  gridHeight = gridHeight;

  game = new Game();


  drag(msg, event) {
    console.log(msg,'drag event started',event);
  }
}

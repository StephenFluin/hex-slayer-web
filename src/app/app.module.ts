import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HexComponent } from './map/hex/hex.component';
import { RangePipe } from './range.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports:      [ BrowserModule, FormsModule, DragDropModule ],
  declarations: [ AppComponent, HexComponent, RangePipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

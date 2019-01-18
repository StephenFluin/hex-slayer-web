import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HexComponent } from './map/hex/hex.component';
import { RangePipe } from './range.pipe';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HexComponent, RangePipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

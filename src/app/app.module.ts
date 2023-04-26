import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './othello/components/board/board.component';
import { HoverClassDirective } from './othello/directives/hover-class.directive';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HoverClassDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoModule} from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../environments/environment';
import {StockState} from './stock/state/stock.state';

@Injectable()
export class SocketChat extends Socket{
  constructor() {
    super({url: 'http://localhost:3000', options: {} });
  }
}

@Injectable()
export class SocketStock extends Socket{
  constructor() {
    super({url: 'http://localhost:3300', options: {} });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    NgbModule,
    NgxsModule.forRoot([StockState], {
      developmentMode: !environment.production
    })
  ],
  providers: [DatePipe, SocketChat, SocketStock],
  bootstrap: [AppComponent]
})
export class AppModule { }

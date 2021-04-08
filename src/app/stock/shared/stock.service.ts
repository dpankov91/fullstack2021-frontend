import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatClient} from '../../chat/shared/chat-client.model';
import {StockModel} from './stock.model';
import {SocketStock} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStock) { }

  listenForStocks(): Observable<StockModel[]>{
    return this.socket
      .fromEvent<StockModel[]>('allStocks');
  }

  disconnect(): void{
    this.socket.disconnect();
  }

  connect(): void{
    this.socket.connect();
  }
}

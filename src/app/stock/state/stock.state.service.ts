import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StockModel} from '../shared/stock.model';
import {SocketStock} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class StockStateService {

  constructor(private socket: SocketStock) { }

  listenForStocks(): Observable<StockModel[]>{
    return this.socket
      .fromEvent<StockModel[]>('allStocks');
  }
  getStock(): Observable<StockModel[]>{
    return this.socket.emit('allStocks');
  }
}

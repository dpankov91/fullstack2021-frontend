import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {StockModel} from './stock.model';
import {SocketStock} from '../../app.module';
import {UpdatePriceDto} from './dtos/update-price.dto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStock) { }

  listenForStocks(): Observable<StockModel[]>{
    return this.socket
      .fromEvent<StockModel[]>('allStocks');
  }

  getStocks(): void {
    console.log('stocks');
    this.socket.emit('allStocks', null);
  }

  listenForErrors(): Observable<string>{
    return this.socket
      .fromEvent<string>('error');
  }

  deleteStock(id: string): void {
    this.socket.emit('deleteStock', id);
  }

  updatePrice(dto: UpdatePriceDto): void {
    this.socket.emit('updatePrice', dto);
  }

  disconnect(): void{
    this.socket.disconnect();
  }

  connect(): void{
    this.socket.connect();
  }


}

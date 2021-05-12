import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {StockService} from './shared/stock.service';
import {StockModel} from './shared/stock.model';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {UpdatePriceDto} from './shared/dtos/update-price.dto';
import {Select, Store} from '@ngxs/store';
import {StockState} from './state/stock.state';
import {ListenForStocks} from './state/state.actions';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Select(StockState.stocks)
  stocks$: Observable<StockModel[]> | undefined;
  unsubscribe$ = new Subject();
  selectedStock: StockModel | undefined;
  priceFC = new FormControl('');
  error$: Observable<string> | undefined;
  constructor(private stockService: StockService,
              private store: Store) {}

  ngOnInit(): void {
    this.error$ = this.stockService.listenForErrors();
    this.store.dispatch(new ListenForStocks());
    this.stockService.getStocks();
    this.stocks$ = this.stockService.listenForStocks();
    console.log('get stocks frontend' + ' ' + this.stocks$);
  }

  loadSelectedStock(stock: StockModel): void {
    this.selectedStock = stock;
    this.priceFC.setValue(stock.price);
  }

  deleteStock(): void {
    this.stockService.deleteStock(this.selectedStock?.id);
    this.selectedStock = null;
  }

  updatePrice(): void {
    if (this.selectedStock?.id && !Number.isNaN(this.priceFC.value)){
      const dto: UpdatePriceDto = {id: this.selectedStock.id, newPrice: this.priceFC.value};
      this.stockService.updatePrice(dto);
    }
  }
}

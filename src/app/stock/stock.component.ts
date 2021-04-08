import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {StockService} from './shared/stock.service';
import {StockModel} from './shared/stock.model';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stocks$: Observable<StockModel[]> | undefined;
  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stocks$ = this.stockService.listenForStocks();
    console.log('get stocks frontend' + ' ' + this.stocks$);
  }

}

import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {StockModel} from '../shared/stock.model';
import {DeleteStock, ListenForStocks, LoadSelectedStock} from './state.actions';
import {StockService} from '../shared/stock.service';

export interface StockStateModel {
  stocks: StockModel[];
}

@State<StockStateModel>({
  name: 'stocks',
  defaults: {
    stocks: [{id: '1', name: 'ratata', description: 'bratatatatata', price: 124 }]
  }
})

@Injectable()
export class StockState {

  constructor(private stockService: StockService) {}

  @Selector()
  static stocks(state: StockStateModel): StockModel[] {
    return state.stocks;
  }

  @Action(ListenForStocks)
  listenForStocks(ctx: StateContext<StockStateModel>): void {
    this.stockService.listenForStocks()
      .subscribe(data => {
        const state = ctx.getState();
        const newState: StockStateModel = {
          ...state,
          stocks: data
        };
        ctx.setState(newState);
      });
  }

  @Action(LoadSelectedStock)
  loadSelectedStock(ctx: StateContext<StockStateModel>): void {
    this.stockService.deleteStock()
      .subscribe(data => {
        const state = ctx.getState();
        const newState: StockStateModel = {
          ...state,
          stocks: data
        };
        ctx.setState(newState);
      });
  }
}

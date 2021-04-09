import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [StockComponent],
    imports: [
        CommonModule,
        StockRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class StockModule { }

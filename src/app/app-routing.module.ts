import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'chats', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
  { path: 'stocks', loadChildren: () => import('./stock/stock.module').then(m => m.StockModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

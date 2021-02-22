import { Component } from '@angular/core';
import {ChatService} from './chat/shared/chat.service';
import {Observable} from 'rxjs';
import {ChatClient} from './chat/shared/chat-client.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  clients$: Observable<ChatClient[]> | undefined;

  constructor(private chatService: ChatService) {

    this.clients$ = this.chatService.listenForClients();
  }
}
